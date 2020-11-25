const express = require("express");
const app = express();
const Student = require("../models/student");

//===================================
//Get all students
//===================================
app.get("/student", (req, res) => {
  let from = Number(req.query.desde) || 0;
  let end = Number(req.query.limite) || 15;

  Student.find()
    .skip(from)
    .limit(end)
    .exec((err, student) => {
      if (err) {
        res.status(500).json({
          ok: false,
          err,
        });
      }
      Student.count((err, cant) => {
        res.json({
          ok: true,
          student,
          total: cant,
        });
      });
    });
});

//===================================
//Add a student
//===================================
app.post("/student", (req, res) => {
  let body = req.body;

  let student = new Student({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone,
    note: body.note,
  });

  student.save((err, studentDB) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!studentDB) {
      res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      student: studentDB,
    });
  });
});

//===================================
//Edit a student
//===================================
app.put("/student/:id", (req, res) => {
  let id = req.params.id;

  Student.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true },
    (err, studentDB) => {
      if (err) {
        res.status(400).json({
          ok: false,
          err,
        });
      }

      if (!studentDB) {
        res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        student: studentDB,
      });
    }
  );
});

//===================================
//Delete a student
//===================================
app.delete("/student/:id", (req, res) => {
  let id = req.params.id;

  Student.findById(id, (err, studentDB) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!studentDB) {
      res.status(400).json({
        ok: false,
        err: {
          message: "The student is not found",
        },
      });
    }

    studentDB.remove((err) => {
      if (err) {
        res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        message: "Student delete with success",
      });
    });
  });
});

module.exports = app;
