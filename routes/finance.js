
const Finance = require("../models/finance");
const { isLoggedIn } = require("../middleware");

router.get("/add-expense",(req, res) => {
  res.render("finance/addExpense"); 
});


router.post("/add-expense", isLoggedIn,async (req, res) => {
    try {
      console.log("Received POST request:", req.body); // Debugging
  
      const { date, category, amount, payment_method, notes } = req.body;
      const user_id = req.user?._id;
  
      if (!user_id) {
        return res.status(401).json({ message: "Unauthorized: User ID missing" });
      }
  
      if (!date || !category || !amount || !payment_method) {
        return res.status(400).json({ message: "All required fields must be filled" });
      }
  
      let finance = await Finance.findOne({ user_id });
  
      if (!finance) {
        finance = new Finance({ user_id, budget: 0, expenses: [], income: [] });
      }
  
      finance.expenses.push({ date, category, amount, payment_method, notes });
      await finance.save();
  
      res.redirect("/home"); // Redirect after submission
  
    } catch (error) {
      console.error("❌ Error:", error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });
  
  router.get("/expenses", async (req, res) => {
    try {
      const user_id = req.user?._id; 
      if (!user_id) return res.status(401).send("Unauthorized");
  
      const finance = await Finance.findOne({ user_id });
  
      if (!finance || finance.expenses.length === 0) {
        return res.render("finance/expenses", { expenses: [] });
      }
  
      res.render("finance/expenses", { expenses: finance.expenses });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });


  router.get("/dashboard", async (req, res) => {
    try {
        const user_id = req.user?._id; // Ensure user is authenticated
        if (!user_id) return res.status(401).send("Unauthorized");

        const finance = await Finance.findOne({ user_id });

        if (!finance) {
            return res.render("finance/charts", { expenses: [], income: [], budget: 0 });
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



module.exports = router;
