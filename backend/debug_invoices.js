
const { MongoClient } = require('mongodb');

async function checkInvoices() {
    // Assuming default local mongo uri or from env
    const uri = 'mongodb://localhost:27017/trade-credit-score';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('trade-credit-score');
        const invoices = await db.collection('invoices').find({}).toArray();

        console.log('--- ALL INVOICES ---');
        invoices.forEach(inv => {
            let iso = 'INVALID';
            try { iso = new Date(inv.dueDate).toISOString(); } catch (e) { }
            console.log(`ID: ${inv._id}, MatchStatus: ${inv.status}, DueDate: ${iso}, SellerId: ${inv.sellerId}`);
        });

        const notifications = await db.collection('notifications').find({}).toArray();
        console.log('--- NOTIFICATIONS ---');
        notifications.forEach(n => {
            console.log(`ID: ${n._id}, Type: ${n.type}, Msg: ${n.message}, UserId: ${n.userId}, InvoiceId: ${n.invoiceId}`);
        });

        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        console.log('--- MATCHING INVOICES FOR REMINDER ---');
        const matched = invoices.filter(inv => {
            const isPending = ['pending', 'partially_paid'].includes(inv.status);
            let isDue = false;
            try { isDue = new Date(inv.dueDate) <= tomorrow; } catch (e) { }
            return isPending && isDue;
        });

        matched.forEach(inv => {
            console.log(`MATCHED: ${inv._id} (Seller: ${inv.sellerId})`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

checkInvoices();
