import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import Device from '$lib/database/models/Device';
import { initializeDB } from '$lib/database';
import { Op } from 'sequelize'; // <-- Pass på at denne er importert

await initializeDB();

export const GET: RequestHandler = async () => {
  const activeDevices = await Device.findAll({
    where: { isConnected: true },
    order: [['createdAt', 'DESC']],
  });

  const totalConnected = await Device.count();
  
  // Fiks: Legg til manglende krøllparentes før }
  const withPhoneNumber = await Device.count({ 
    where: { 
      phone: { 
        [Op.ne]: null 
      } 
    } 
  });

  const percentageWithPhone = totalConnected > 0 ? (withPhoneNumber / totalConnected) * 100 : 0;

  const allClasses = await Device.findAll({
    attributes: ['class', 'phone'],
    where: { 
      phone: { 
        [Op.ne]: null 
      } 
    },
  });

  return json({
    activeDevices,
    totalConnected,
    withPhoneNumber,
    percentageWithPhone,
    allClasses,
  });
};