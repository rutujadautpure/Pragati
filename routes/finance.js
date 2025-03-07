const express = require("express");
const router = express.Router();
const Finance = require("../models/Finance");
const { isLoggedIn } = require("../middleware");



router.get("/add-expense", isLoggedIn, (req, res) => {
  res.render("./finance/addExpense"); 
});

router.get("/set-budget", isLoggedIn, (req, res) => {
  res.render("./finance/addExpense"); 
});

router.get("/add-income", isLoggedIn, (req, res) => {
  res.render("./finance/addExpense"); 
});

router.post("/add-income", async (req, res) => {
  try {
    const { user_id, date, source, amount, payment_method } = req.body;

    if (!user_id || !date || !source || !amount || !payment_method) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let finance = await Finance.findOne({ user_id });

    if (!finance) {
      finance = new Finance({ user_id, budget: 0, expenses: [], income: [] });
    }

    finance.income.push({ date, source, amount, payment_method });
    await finance.save();

    res.redirect("/finance"); // Redirect to finance page after adding income
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

router.post("/set-budget", async (req, res) => {
  try {
    const { user_id, budget } = req.body;

    if (!user_id || budget === undefined) {
      return res.status(400).json({ message: "User ID and budget are required" });
    }

    let finance = await Finance.findOne({ user_id });

    if (!finance) {
      finance = new Finance({ user_id, budget, expenses: [], income: [] });
    } else {
      finance.budget = budget;
    }

    await finance.save();

    res.redirect("/finance"); // Redirect to finance page after setting budget
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Assuming you are using user authentication to get the logged-in user's ID
router.get("/dashboard", async (req, res) => {
  console.log(req.session.userId);
  try {
    const userId = req.user._id; // or get the user ID from the session
    const financeData = await Finance.findOne({ user_id: userId });

    if (!financeData) {
      return res.status(404).send("Finance data not found.");
    }

    const expenses = financeData.expenses;
    const income = financeData.income;
    const budget = financeData.budget;

    // Send the data to the EJS view
    res.render("./finance/dashboard", { 
      expenses: expenses,
      income: income,
      budget: budget
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
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

    res.redirect(`expenses/${user_id}`);
    res.render("./finance/expenses")
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
