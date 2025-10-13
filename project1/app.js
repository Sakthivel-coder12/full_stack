const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

// Car rental rates
const carRates = {
    'Toyota Corolla': 2500,
    'Honda City': 3000,
    'Mahindra Scorpio': 4000,
    'Hyundai Creta': 3500
};

let rentalIdCounter = 1;
let bookings = [];

// Home page with booking form
app.get('/', (req, res) => {
    res.render('index', { carModels: Object.keys(carRates) });
});

// Handle booking via GET
app.get('/book', (req, res) => {
    const { rentalDate, carModel, rentalDays } = req.query;
    
    // Validate input
    if (!rentalDate || !carModel || !rentalDays) {
        return res.send('Error: All fields are required! <a href="/">Go Back</a>');
    }
    
    const days = parseInt(rentalDays);
    if (days <= 0) {
        return res.send('Error: Rental days must be positive! <a href="/">Go Back</a>');
    }
    
    // Calculate total
    const rate = carRates[carModel];
    const total = rate * days;
    
    // Create booking
    const booking = {
        id: rentalIdCounter++,
        date: rentalDate,
        car: carModel,
        days: days,
        total: total
    };
    
    bookings.push(booking);
    
    // Show receipt
    res.render('receipt', { booking });
});

// View all bookings
app.get('/bookings', (req, res) => {
    res.render('bookings', { bookings });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});