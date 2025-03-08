const express = require('express');
const router = express.Router();
const Finance = require("../models/finance");
const { isLoggedIn } = require("../middleware");

// ✅ Route to render expense form
router.get("/add-expense", isLoggedIn, (req, res) => {
  console.log("Current User:", req.user); // Debugging

  if (!req.isAuthenticated()) {
    req.flash("error", "Please log in first.");
    return res.redirect("/login");
  }

  res.render("finance/addExpense", { userId: req.user._id });
});

router.get("/add-income", (req, res) => {
  console.log("Current User:", req.user); // Debugging

  if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized: Please log in.");
  }

  res.render("finance/addIncome", { userId: req.user._id });
});

router.get("/set-budget", (req, res) => {
  console.log("Current User:", req.user); // Debugging

  if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized: Please log in.");
  }

  res.render("finance/setBudget", { userId: req.user._id });
});

router.post("/add-income", async (req, res) => {
  if (!req.isAuthenticated()) {
      req.flash("error", "Please log in first.");
      return res.redirect("/login");
  }

  try {
      let finance = await Finance.findOne({ user_id: req.user._id });

      if (!finance) {
          finance = new Finance({
              user_id: req.user._id,
              budget: 0,
              expenses: [],
              income: []
          });
      }

      finance.income.push({
          date: req.body.date,
          source: req.body.source,
          amount: req.body.amount,
          payment_method: req.body.payment_method
      });

      await finance.save();
      req.flash("success", "Income added successfully!");
      res.redirect("/finance/dashboard");

  } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong.");
      res.redirect("/finance/add-income");
  }
});

router.post("/set-budget", async (req, res) => {
  if (!req.isAuthenticated()) {
      req.flash("error", "Please log in first.");
      return res.redirect("/login");
  }

  try {
      let finance = await Finance.findOne({ user_id: req.user._id });

      if (!finance) {
          finance = new Finance({
              user_id: req.user._id,
              budget: req.body.budget,
              expenses: [],
              income: []
          });
      } else {
          finance.budget = req.body.budget;  // Update the existing budget
      }

      await finance.save();
      req.flash("success", "Budget updated successfully!");
      res.redirect("/finance/dashboard");

  } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong.");
      res.redirect("/set-budget");
  }
});


router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    let financeData = await Finance.findOne({ user_id: userId });

    // If finance data doesn't exist, create a new entry
    if (!financeData) {
      financeData = new Finance({
        user_id: userId,
        budget: 0, // Default budget
        expenses: [],
        income: [],
      });
      await financeData.save();
    }

    res.render("finance/dashboard", { 
      expenses: financeData.expenses,
      income: financeData.income,
      budget: financeData.budget
    });

  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/login");
  }
});


router.post("/add-expense", isLoggedIn, async (req, res) => {
  try {
    const { date, category, amount, payment_method, notes } = req.body;
    const user_id = req.user._id; 

    if (!date || !category || !amount || !payment_method) {
      req.flash("error", "All required fields must be filled.");
      return res.redirect("/finance/dashboard");
    }

    let finance = await Finance.findOne({ user_id });

    if (!finance) {
      finance = new Finance({ user_id, budget: 0, expenses: [], income: [] });
    }

    finance.expenses.push({ date, category, amount, payment_method, notes });
    await finance.save();

    req.flash("success", "Expense added successfully!");
    res.redirect("/finance/dashboard");
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/finance/dashboard");
  }
});


router.get("/expenses/:id", async (req, res) => {
  try {
    const user_id = req.params.id;
    const finance = await Finance.findOne({ user_id });

    if (!finance) {
      return res.status(404).json({ message: "No financial records found" });
    }

    res.render("finance/expenses", { expenses: finance.expenses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
