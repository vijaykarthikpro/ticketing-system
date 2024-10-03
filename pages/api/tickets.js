// pages/api/tickets.js
let ticketQueue = [];
let currentTicket = 0;

export default function handler(req, res) {
    if (req.method === 'POST') {
        // Add user to the queue
        const userId = Date.now(); // Simple unique ID
        ticketQueue.push(userId);
        res.status(200).json({ message: 'You have entered the queue', userId });
    } else if (req.method === 'GET') {
        // Check the current ticket
        const isNext = currentTicket < ticketQueue.length;
        const nextUserId = isNext ? ticketQueue[currentTicket] : null;

        if (nextUserId) {
            currentTicket++;
        }

        res.status(200).json({ nextUserId, currentTicket, totalInQueue: ticketQueue.length });
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
