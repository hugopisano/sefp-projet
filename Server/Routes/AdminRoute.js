import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const router = express.Router();

router.post('/adminlogin', (req, res) => {
    const sql = "SELECT * from admin Where email = ? and password = ?";

    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" })
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign({ role: "admin", email: email, id: result[0].id }, "jwt_secret_key", { expiresIn: '1d' })
            res.cookie('token', token)
            return res.json({ loginStatus: true })
        } else {
            return res.json({ loginStatus: false, Error: "Mot de passe ou email incorrect." })
        }
    })
})

router.post('/add_employee', (req, res) => {
    const sql = "INSERT INTO employee (`nom`, `prenom`, `immatriculation`) VALUES (?, ?, ?)";
    con.query(sql, [req.body.nom, req.body.prenom, req.body.immatriculation], (err, result) => {
        if (err) {
            console.log("Error:", err);
            return res.json({ Status: false, Error: "Query error" });
        } else {
            console.log("Result:", result);
            return res.json({ Status: true });
        }
    });
});

router.get('/employee', (req, res) => {
    const sql = "SELECT * from employee";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * from employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query error" })
        return res.json({ Status: true, Result: result })
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee set nom= ?, prenom= ?, immatriculation= ? Where id = ?";
    const values = [
        req.body.nom,
        req.body.prenom,
        req.body.immatriculation
    ]
    con.query(sql, [...values, id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query error" })
        return res.json({ Status: true, Result: result })
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from employee where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/unassigned_employees', (req, res) => {
    const sql = "SELECT * FROM employee WHERE id NOT IN (SELECT employee_id FROM assignments)";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query error" })
        return res.json({ Status: true, Result: result })
    })
})

router.post('/assign_to_post', (req, res) => {
    const postId = req.body.post;
    const employeeId = req.body.id;

    // Vérifiez d'abord si le poste n'est pas déjà complet
    const checkQuery = "SELECT COUNT(*) AS count FROM assignments WHERE post_id = ?";
    con.query(checkQuery, [postId], (err, result) => {
        if (err) {
            console.log("Error:", err);
            return res.json({ Status: false, Error: "Query error" });
        } else {
            if (result[0].count < 2) {
                // Si le poste n'est pas complet, procédez à l'assignation
                const insertSql = "INSERT INTO assignments (`employee_id`, `post_id`, `date_assigned`) VALUES (?, ?, NOW())";
                con.query(insertSql, [employeeId, postId], (insertErr, insertResult) => {
                    if (insertErr) {
                        console.log("Insert Error:", insertErr);
                        return res.json({ Status: false, Error: "Insert query error" });
                    } else {
                        console.log("Insert Result:", insertResult);
                        return res.json({ Status: true });
                    }
                });
            } else {
                // Le poste est complet
                return res.json({ Status: false, Error: "Poste déjà complet" });
            }
        }
    });
});

router.get('/post_status/:postId', (req, res) => {
    const postId = req.params.postId;

    const sql = "SELECT COUNT(*) AS count FROM assignments WHERE post_id = ?";
    con.query(sql, [postId], (err, result) => {
        if (err) {
            console.log("Error:", err);
            return res.json({ Status: false, Error: "Query error" });
        } else {
            const isFull = result[0].count >= 2; // Supposons que 2 est le nombre maximum
            return res.json({ Status: true, PostFull: isFull });
        }
    });
});

router.get('/employees_by_post/:postId', (req, res) => {
    const postId = req.params.postId;

    const sql = `
        SELECT e.* 
        FROM employee e
        INNER JOIN assignments a ON e.id = a.employee_id
        WHERE a.post_id = ?;
    `;

    con.query(sql, [postId], (err, result) => {
        if (err) {
            console.log("Error:", err);
            return res.json({ Status: false, Error: "Query error" });
        } else {
            return res.json({ Status: true, Employees: result });
        }
    });
});

router.post('/record_pallet', (req, res) => {
    // Remplacez ces champs par les noms réels des champs de votre formulaire
    const { employeeId, length, width, woodType, additionalOptions } = req.body;

    // Assurez-vous que les champs nécessaires sont présents
    if (!employeeId || !length || !width || !woodType) {
        return res.status(400).json({ Status: false, Error: "Missing required fields" });
    }

    const sql = `
        INSERT INTO pallets (employee_id, length, width, wood_type, additional_options)
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [employeeId, length, width, woodType, additionalOptions];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ Status: false, Error: "Database query error" });
        }
        return res.json({ Status: true, Result: "Pallet recorded successfully" });
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({ Status: true })
})

router.get('/daily_production', (req, res) => {
    // Remplacez ceci par votre requête SQL appropriée
    const sql = `
        SELECT 
        e.nom, 
        e.prenom, 
        MAX(p.date_assigned) as lastAssignedDate, 
        COUNT(*) as totalProduced
    FROM 
        pallets p
        JOIN employee e ON p.employee_id = e.id
    WHERE 
        DATE(p.date_assigned) = CURDATE()
    GROUP BY 
        e.id, e.nom, e.prenom
    ORDER BY 
        totalProduced DESC;
    `;

    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ Status: false, Error: "Database query error" });
        }
        return res.json({ Status: true, Data: results });
    });
});

router.get('/total_pallets_today', async (req, res) => {
    const sql = `SELECT COUNT(*) AS totalProducedToday FROM pallets WHERE DATE(date_assigned) = CURDATE()`;

    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ Status: false, Error: "Database query error" });
        }
        return res.json({ Status: true, Data: results });
    });
});

router.get('/stats/pallets/daily', (req, res) => {
    const sql = `
    SELECT DATE_FORMAT(date_assigned, '%Y-%m-%d') AS date, COUNT(*) AS total_pallets
    FROM pallets
    WHERE date_assigned >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) - 0 DAY)
        AND date_assigned < CURDATE() + INTERVAL 1 DAY
        AND WEEKDAY(date_assigned) BETWEEN 0 AND 4
    GROUP BY date
    ORDER BY date;  
  `;
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ Status: false, Error: "Database query error" });
        }
        res.json({ Status: true, Data: results });
    });
});

router.get('/stats/pallets/week', (req, res) => {

    const sql = `SELECT DATE_FORMAT(date_assigned, '%Y-%m-%d') AS date, COUNT(*) AS total_pallets
                FROM pallets
                WHERE YEARWEEK(date_assigned, 1) = YEARWEEK(CURDATE(), 1)
                AND DAYOFWEEK(date_assigned) BETWEEN 2 AND 6
                GROUP BY date
                ORDER BY date;
                `;

    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ Status: false, Error: "Database query error" });
        }
        res.json({ Status: true, Data: results });
    });
});

router.get('/stats/pallets/month', (req, res) => {

    const sql = `SELECT DATE_FORMAT(date_assigned, '%Y-%m-%d') AS date, COUNT(*) AS total_pallets
                   FROM pallets
                   WHERE YEAR(date_assigned) = YEAR(CURDATE()) AND MONTH(date_assigned) = MONTH(CURDATE())
                   GROUP BY date
                   ORDER BY date;`;

    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ Status: false, Error: "Database query error" });
        }
        res.json({ Status: true, Data: results });
    });
});

router.get('/stats/pallets/year', (req, res) => {

    const sql = `SELECT DATE_FORMAT(date_assigned, '%Y') AS year, COUNT(*) AS total_pallets
    FROM pallets
    GROUP BY year
    ORDER BY year;`;

    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ Status: false, Error: "Database query error" });
        }
        res.json({ Status: true, Data: results });
    });
});

// router.get('/daily_pallets_for_employee_of_the_month/:year/:month', (req, res) => {
//     const year = req.params.year;
//     const month = req.params.month;

//     const employeeQuery = `
//         SELECT e.id, e.nom, e.prenom
//         FROM employee e
//         JOIN pallets p ON e.id = p.employee_id
//         WHERE YEAR(p.date_assigned) = ? AND MONTH(p.date_assigned) = ?
//         GROUP BY e.id
//         ORDER BY COUNT(*) DESC
//         LIMIT 1;
//     `;

//     const sql = `
//             SELECT 
//             DATE_FORMAT(p.date_assigned, '%Y-%m-%d') AS date,
//             COUNT(*) AS total_pallets
//         FROM 
//             pallets p
//         WHERE 
//             YEAR(p.date_assigned) = ? AND MONTH(p.date_assigned) = ?
//             AND p.employee_id = (
//                 SELECT employee_id
//                 FROM pallets
//                 WHERE YEAR(date_assigned) = ? AND MONTH(date_assigned) = ?
//                 GROUP BY employee_id
//                 ORDER BY COUNT(*) DESC
//                 LIMIT 1
//             )
//         GROUP BY 
//             DATE_FORMAT(p.date_assigned, '%Y-%m-%d')
//         ORDER BY 
//             DATE_FORMAT(p.date_assigned, '%Y-%m-%d');
//     `;

//     con.query(sql, [year, month, year, month], (err, results) => {
//         if (err) {
//             console.error("Error:", err);
//             return res.status(500).json({ Status: false, Error: "Database query error" });
//         }
//         res.json({ Status: true, DailyPallets: results });
//     });
// });

router.get('/employee_of_the_month_data/:year/:month', async (req, res) => {
    const year = req.params.year;
    const month = req.params.month;

    // Trouver l'employé du mois
    const employeeQuery = `
        SELECT e.id, e.nom, e.prenom
        FROM employee e
        JOIN pallets p ON e.id = p.employee_id
        WHERE YEAR(p.date_assigned) = ? AND MONTH(p.date_assigned) = ?
        GROUP BY e.id
        ORDER BY COUNT(*) DESC
        LIMIT 1;
    `;

    let employeeOfTheMonth;
    try {
        const employeeResult = await queryPromise(con, employeeQuery, [year, month]);
        if (employeeResult.length === 0) {
            return res.status(404).json({ Status: false, Error: "No employee found for the specified month" });
        }
        employeeOfTheMonth = employeeResult[0];
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ Status: false, Error: "Database query error", Details: err.message });
    }

    // Obtenir les données de production quotidienne
    const productionQuery = `
    SELECT 
        DATE_FORMAT(p.date_assigned, '%Y-%m-%d') AS date,
        COUNT(*) AS total_pallets
    FROM 
        pallets p
    WHERE 
        YEAR(p.date_assigned) = ? AND MONTH(p.date_assigned) = ?
        AND p.employee_id = ?
    GROUP BY 
        DATE_FORMAT(p.date_assigned, '%Y-%m-%d')
    ORDER BY 
        DATE_FORMAT(p.date_assigned, '%Y-%m-%d');
`;

    try {
        const productionData = await queryPromise(con, productionQuery, [year, month, employeeOfTheMonth.id]);
        res.json({
            Status: true,
            EmployeeOfTheMonth: employeeOfTheMonth,
            DailyPallets: productionData
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ Status: false, Error: "Database query error", Details: err.message });
    }
});

function queryPromise(con, query, params) {
    return new Promise((resolve, reject) => {
        con.query(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}







export { router as adminRouter }