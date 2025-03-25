import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import Device from '$lib/database/models/Device';
import { initializeDB } from '$lib/database';
import { Op } from 'sequelize';

// Initialize database
await initializeDB();

export const GET: RequestHandler = async () => {
  try {
    const activeDevices = await Device.findAll({
      where: { isConnected: true },
      order: [['createdAt', 'DESC']],
    });

    const totalConnected = await Device.count();
    const withPhoneNumber = await Device.count({ 
      where: { 
        phone: { 
          [Op.ne]: null 
        } 
      } 
    });

    const percentageWithPhone = totalConnected > 0 
      ? Math.round((withPhoneNumber / totalConnected) * 100 * 10) / 10 
      : 0;

    const allClasses = await Device.findAll({
      attributes: ['class', 'phone'],
      where: { 
        phone: { 
          [Op.ne]: null 
        } 
      },
    });

    return json({
      status: "success",
      data: {
        activeDevices,
        totalConnected,
        withPhoneNumber,
        percentageWithPhone,
        allClasses,
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return json(
      { status: "error", message: errorMessage },
      { status: 500 }
    );
  }
};

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.os) {
      return json({ 
        status: "error",
        message: "OS is required" 
      }, { status: 400 });
    }

    // Save to database
    await Device.create({
      name: data.name || null,
      phone: data.phone || null,
      class: data.class || null,
      os: data.os,
      ip: getClientAddress(),
      mac: data.mac || null,
      isConnected: true
    });

    return json({ 
      status: "success",
      message: "Device data saved successfully"
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return json(
      { 
        status: "error",
        message: errorMessage 
      },
      { status: 500 }
    );
  }
};