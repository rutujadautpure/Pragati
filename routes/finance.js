const express = require("express");
const router = express.Router();
const Finance = require("../models/Finance");
const { isLoggedIn } = require("../middleware");



router.get("/add-expense", isLoggedIn, (req, res) => {
  res.render("./finance/addExpense"); 
});

router.get("/expenses", isLoggedIn, (req, res) => {
  res.render("./finance/expenses"); 
});

router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const user_id = req.user._id;
    const finance = await Finance.findOne({ user_id });

    if (!finance) {
      return res.status(404).json({ message: "No financial records found" });
    }

 
    res.render("finance/charts", {
      expenses: finance.expenses,
      income: finance.income,
      budget: finance.budget
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



router.post("/add-expense", isLoggedIn,async (req, res) => {
  try {
    const { date, category, amount, payment_method, notes } = req.body;
    const user_id = req.user._id; 


    if (!date || !category || !amount || !payment_method) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    let finance = await Finance.findOne({ user_id });

    if (!finance) {
      finance = new Finance({ user_id, budget: 0, expenses: [], income: [] });
    }

    finance.expenses.push({ date, category, amount, payment_method, notes });

    await finance.save();

    res.status(201).json({ message: "Expense added successfully", expense: finance.expenses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/expenses/:id", async (req, res) => {
  try {
    const user_id = req.params.id;
    const finance = await Finance.findOne({ user_id });

    if (!finance) {
      return res.status(404).json({ message: "No financial records found" });
    }

    res.render("./finance/expenses", {
      expenses: finance.expenses 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



module.exports = router;
