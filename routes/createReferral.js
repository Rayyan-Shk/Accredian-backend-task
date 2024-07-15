require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const zod = require('zod');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

const ReferralSchema = zod.object({
    referralName: zod.string().min(2).max(40),
    referralEmail: zod.string().email(),
    referralDetails: zod.string().min(2).max(60),
    referrerName: zod.string().min(2).max(40),   
    referrerEmail: zod.string().email()
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


async function sendEmail({ to, subject, body }) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: body,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


const filePath = path.join(__dirname, 'referrals.json');


function appendToJsonFile(data) {
    try {
        
        let existingData = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath);
            existingData = JSON.parse(fileData);
        }

      
        existingData.push(data);

       
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    } catch (error) {
        console.error('Error writing to JSON file:', error);
    }
}

router.post('/createReferral', async (req, res) => {
    try {
       
        const validationResult = ReferralSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({ error: 'Validation error', details: validationResult.error.errors });
        }

       
        const { referralName, referralEmail, referralDetails, referrerName, referrerEmail } = validationResult.data;

      
        const referral = await prisma.referral.create({
            data: {
                referralName,
                referralEmail,
                referralDetails,
                referrerName,
                referrerEmail
            },
        });

        
        appendToJsonFile(validationResult.data);

       
        const emailSubject = 'New Referral Received';
        const emailBody = `
            <p>Referral received:</p>
            <p><strong>Referral Name:</strong> ${referralName}</p>
            <p><strong>Referral Email:</strong> ${referralEmail}</p>
            <p><strong>Referral Details:</strong> ${referralDetails}</p>
            <p><strong>Referrer Name:</strong> ${referrerName}</p>
            <p><strong>Referrer Email:</strong> ${referrerEmail}</p>
        `;

        // Send email notification (commented out)
        // await sendEmail({
        //     to: referralEmail,
        //     subject: emailSubject,
        //     body: emailBody,
        // });

        res.status(201).json(referral);
    } catch (error) {
        console.error('Error creating referral:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
