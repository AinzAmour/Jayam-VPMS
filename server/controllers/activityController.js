import ActivityLog from '../models/ActivityLog.js';

export const getActivities = async (req, res, next) => {
  try {
    const { action, search, page = 1, limit = 25 } = req.query;
    const query = {};

    if (action && action !== 'ALL') {
      query.action = action;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { passId: regex },
        { performedByName: regex },
        { remarks: regex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const totalRecords = await ActivityLog.countDocuments(query);
    const records = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('performedByUserId', 'fullName email role');

    return res.status(200).json({
      success: true,
      data: {
        records,
        pagination: {
          totalRecords,
          currentPage: pageNum,
          totalPages: Math.ceil(totalRecords / limitNum) || 1,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
