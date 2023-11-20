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

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({ Status: true })
})


export { router as adminRouter }