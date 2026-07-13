const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const dayjs = require('dayjs');

const Customer = require('../models/Customer');
const { getCustomerMonthlyBill } = require('../services/billingService');

const resolveCustomerId = async (req) => {
  if (req.user.role === 'customer') {
    return req.user.customerRef;
  }

  return req.params.customerId || req.query.customerId;
};

const getMonthlyBill = async (req, res, next) => {
  try {
    const month = req.query.month || dayjs().format('YYYY-MM');
    const customerId = await resolveCustomerId(req);

    if (!customerId) {
      const error = new Error('Customer ID is required.');
      error.statusCode = 400;
      throw error;
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      const error = new Error('Customer not found.');
      error.statusCode = 404;
      throw error;
    }

    const bill = await getCustomerMonthlyBill(customer._id, month);

    return res.json({
      success: true,
      data: {
        customer,
        ...bill
      }
    });
  } catch (error) {
    return next(error);
  }
};

const exportBillPdf = async (req, res, next) => {
  try {
    const month = req.query.month || dayjs().format('YYYY-MM');
    const customerId = await resolveCustomerId(req);

    const customer = await Customer.findById(customerId);

    if (!customer) {
      const error = new Error('Customer not found.');
      error.statusCode = 404;
      throw error;
    }

    const bill = await getCustomerMonthlyBill(customer._id, month);

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${customer.customerId}-${month}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text('Smart Dairy Milk Management System', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Invoice Month: ${month}`);
    doc.text(`Customer: ${customer.name} (${customer.customerId})`);
    doc.text(`Address: ${customer.address}`);
    doc.text(`Mobile: ${customer.mobileNumber}`);
    doc.moveDown();

    doc.fontSize(11).text('Date        Morning   Evening   Total(L)   Rate   Amount');
    doc.moveDown(0.5);

    bill.entries.forEach((entry) => {
      doc.text(
        `${dayjs(entry.date).format('DD-MM-YYYY')}   ${entry.morningMilk.toFixed(2)}      ${entry.eveningMilk.toFixed(2)}      ${entry.totalLitres.toFixed(2)}      ${entry.ratePerLitre.toFixed(2)}   ${entry.totalAmount.toFixed(2)}`
      );
    });

    doc.moveDown();
    doc.fontSize(12).text(`Total Litres: ${bill.totalLitres.toFixed(2)} L`);
    doc.text(`Total Amount: Rs. ${bill.totalAmount.toFixed(2)}`);
    doc.text(`Paid Amount: Rs. ${bill.paidAmount.toFixed(2)}`);
    doc.text(`Due Amount: Rs. ${bill.dueAmount.toFixed(2)}`);
    doc.text(`Payment Status: ${bill.paymentStatus}`);

    doc.end();
  } catch (error) {
    return next(error);
  }
};

const exportBillExcel = async (req, res, next) => {
  try {
    const month = req.query.month || dayjs().format('YYYY-MM');
    const customerId = await resolveCustomerId(req);
    const customer = await Customer.findById(customerId);

    if (!customer) {
      const error = new Error('Customer not found.');
      error.statusCode = 404;
      throw error;
    }

    const bill = await getCustomerMonthlyBill(customer._id, month);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Invoice');

    sheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Morning', key: 'morning', width: 12 },
      { header: 'Evening', key: 'evening', width: 12 },
      { header: 'Total Litres', key: 'totalLitres', width: 12 },
      { header: 'Rate', key: 'rate', width: 10 },
      { header: 'Amount', key: 'amount', width: 12 }
    ];

    bill.entries.forEach((entry) => {
      sheet.addRow({
        date: dayjs(entry.date).format('DD-MM-YYYY'),
        morning: entry.morningMilk,
        evening: entry.eveningMilk,
        totalLitres: entry.totalLitres,
        rate: entry.ratePerLitre,
        amount: entry.totalAmount
      });
    });

    sheet.addRow({});
    sheet.addRow({ date: 'Total', totalLitres: bill.totalLitres, amount: bill.totalAmount });
    sheet.addRow({ date: 'Paid', amount: bill.paidAmount });
    sheet.addRow({ date: 'Due', amount: bill.dueAmount });

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${customer.customerId}-${month}.xlsx`
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMonthlyBill,
  exportBillPdf,
  exportBillExcel
};
