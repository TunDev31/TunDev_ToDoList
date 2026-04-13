import Task from "../models/Tasks.js";


export const getAllTasks = async (req, res) => {
    const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;

  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 2025-08-24 00:00
      break;
    }
    case "week": {
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null;
    }
  }
  const query = startDate ? { createdAt: { $gte: startDate } } : {};
    try {
       const result = await Task.aggregate([
        {$match: query},
        {
            $facet : {
                tasks: [{$sort: {createdAt: -1}}],
                activeCount: [{$match: {status: "active"}},{$count: "count"}],
                completedCount: [{$match: {status: "completed"}},{$count: "count"}]
            },
        },
       ]);
       const tasks = result[0].tasks;
       const activeCount = result[0].activeCount[0] ? result[0].activeCount[0].count : 0;
       const completedCount = result[0].completedCount[0] ? result[0].completedCount[0].count : 0;
       res.status(200).json({tasks, activeCount, completedCount});
    } catch (error){
        console.error("Loi khi goi getAllTasks", error);
        res.status(500).json({message:"Loi he thong"});
    }
    
}
export const createTask = async (req, res) => {
   try {
    const {title} = req.body;
    const task = new Task({title});
    const newTasks = await task.save();
    res.status(201).json(newTasks);
   } catch (error) {
    console.error("Loi khi goi createTask", error);
    res.status(500).json({message:"Loi he thong"});
   }
}
export const updateTask = async (req, res) => {
   try {
        const {title, status , completeAt} = req.body;
        const updateTask = await Task.findByIdAndUpdate (
            req.params.id, 
            {
                title, 
                status,
                completeAt
            },
            {returnDocument: "after"}
        );
        if (!updateTask) {
           return res.status(404).json({message: "Nhiem vu khong ton tai!"});
        } res.status(201).json({message: "Updated Completely!"})
   } catch (error) {
    console.error("Loi khi goi updateTask", error);
    res.status(500).json({message:"Loi he thong"});
   }
}
export const deleteTask = async (req, res) => {
    try {
        const deleteTask = await Task.findByIdAndDelete(req.params.id );
        if (!deleteTask) {
            return res.status(404).json({message:"Nhiem vu khong ton tai!"})
        }
         res.status(201).json({message: "Deleted Completely!"})
    } catch (error) {
        console.error("Loi khi goi deleteTask", error);
        res.status(500).json({message:"Loi he thong"});
    }
}