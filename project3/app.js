const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Ticket prices
const eventPrices = {
    'Concert': 1200,
    'Workshop': 800,
    'Seminar': 500,
    'Play': 700
};

let ticketCounter = 1;
let tickets = {};

// Home page with booking form
app.get('/', (req, res) => {
    res.render('index', { events: Object.keys(eventPrices) });
});

// Handle booking via POST
app.post('/book', (req, res) => {
    const { eventName, date, numTickets } = req.body;
    
    if (!eventName || !date || !numTickets) {
        return res.send('Error: All fields required! <a href="/">Go Back</a>');
    }
    
    const ticketsCount = parseInt(numTickets);
    if (ticketsCount <= 0) {
        return res.send('Error: Tickets must be positive! <a href="/">Go Back</a>');
    }
    
    // Calculate total
    const price = eventPrices[eventName];
    const total = price * ticketsCount;
    
    // Create ticket
    const ticketNo = ticketCounter++;
    const ticket = {
        ticketNo: ticketNo,
        eventName: eventName,
        date: date,
        numTickets: ticketsCount,
        total: total
    };
    
    tickets[ticketNo] = ticket;
    
    // Show receipt after booking
    res.redirect(`/receipt/${ticketNo}`);
});

// GET route for receipt with ticket number
app.get('/receipt/:ticketNo', (req, res) => {
    const ticketNo = parseInt(req.params.ticketNo);
    const ticket = tickets[ticketNo];
    
    if (!ticket) {
        return res.send('Ticket not found! <a href="/">Go Back</a>');
    }
    
    res.render('receipt', { ticket });
});

// View all bookings
app.get('/bookings', (req, res) => {
    res.render('bookings', { tickets: Object.values(tickets) });
});

// Delete single booking
app.get('/delete/:ticketNo', (req, res) => {
    const ticketNo = parseInt(req.params.ticketNo);
    
    if (tickets[ticketNo]) {
        delete tickets[ticketNo];
        res.redirect('/bookings');
    } else {
        res.send('Ticket not found! <a href="/bookings">Go Back</a>');
    }
});

// Delete all bookings
app.get('/delete-all', (req, res) => {
    tickets = {};
    ticketCounter = 1;
    res.redirect('/bookings');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});