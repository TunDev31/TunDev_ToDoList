import React, { useEffect } from 'react'
import Header from '@/components/Header'
import AddTask from '@/components/AddTask'
import StatsAndFilters from '@/components/StatsAndFilters'
import TaskList from '@/components/TaskList'
import TaskListPagination from '@/components/TaskListPagination'
import DateTimeFilter from '@/components/DateTimeFilter'
import Footer from '@/components/Footer'
import { useState } from 'react'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { visibleTasksLimit } from '@/lib/data'
const HomePage = () => {
const [taskBuffer, setTaskBuffer] = useState([]);
const [activeTaskCount, setActiveTaskCount] = useState(0);
const [completedTaskCount, setCompletedTaskCount] = useState(0);
const [filter, setFilter] = useState("all");
const [dateQuery, setDateQuery] = useState("today");
const [page, setPage] = useState(1);
useEffect(() => {
  fetchTasks();
}, [dateQuery]);
useEffect(() => {
  setPage(1);
}, [dateQuery,filter]);
const fetchTasks = async () => {
  try {
    const res = await api.get(`/tasks?filter=${dateQuery}`);
    setTaskBuffer(res.data.tasks);
    setActiveTaskCount(res.data.activeCount)
    setCompletedTaskCount(res.data.completedCount);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to fetch tasks. Please try again later.");
  }

}
const filteredTasks = taskBuffer.filter((task) => {
  switch (filter) {
    case "active":
      return task.status === "active";
    case "completed":
      return task.status === "completed";
      default: return true;
  }
});

const visibleTask = filteredTasks.slice((page - 1) * visibleTasksLimit, page * visibleTasksLimit);
const totalPages = Math.ceil(filteredTasks.length / visibleTasksLimit);

const handleTaskChanged = () => {
  fetchTasks();
}
const handleNextPage = () => {
  if (page < totalPages) {
    setPage((prev) => prev + 1);
  }
}
const handlePrevPage = () => {
  if (page > 1) {
    setPage((prev) => prev - 1);
  } 
}
const handleNewPage = (newPage) => {
  setPage(newPage);
}
if (visibleTask.length === 0 && page > 1) {
  handlePrevPage();
}
  return (

    <div className="min-h-screen w-full bg-[#fefcff] relative">


  {/* Dreamy Sky Pink Glow */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
    }}
  />
    {/* Your Content/Components */}
      <div className='container pt-8 mx-auto relative z-10'>
        <div className='w-full max-w-2xl p-6 mx-auto space-y-6'>

            <Header/>

            <AddTask handleNewTaskAdded={handleTaskChanged}/>

            <StatsAndFilters 
              activeTaskCount={activeTaskCount}
              completedTaskCount={completedTaskCount}
              filter={filter}
              setFilter={setFilter}
            />

            <TaskList filteredTasks={visibleTask} filter={filter} handleTaskChanged={handleTaskChanged}/>

            <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
                <TaskListPagination handleNextPage={handleNextPage} handlePrevPage={handlePrevPage} handleNewPage={handleNewPage} page={page} totalPages={totalPages}/>
                <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery}/>
            </div>

            <Footer
              activeTasksCount={activeTaskCount}
              completedTasksCount={completedTaskCount}
            
            />

        </div>
    </div>
</div>
  
  )
}

export default HomePage