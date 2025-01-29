import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the data file where trade plans are stored
const dataFilePath = path.join(process.cwd(), 'data.json');

// Handle POST requests to save a new trade plan
export async function POST(req: NextRequest) {
  const newTradePlan = await req.json(); // Read and parse the incoming JSON body

  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    const data = fileData ? JSON.parse(fileData) : [];
    data.push(newTradePlan);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json(newTradePlan, { status: 201 }); // Return the new trade plan with 201 status
  } catch (error) {
    console.error('Error saving trade plan:', error);
    return NextResponse.json({ message: 'Error saving trade plan' }, { status: 500 });
  }
}

// Handle GET requests to retrieve all trade plans
export async function GET(req: NextRequest) {
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    const data = fileData ? JSON.parse(fileData) : [];
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error retrieving trade plans:', error);
    return NextResponse.json({ message: 'Error retrieving trade plans' }, { status: 500 });
  }
}
