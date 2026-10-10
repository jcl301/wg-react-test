import { useRef, useState, type ChangeEvent, type SubmitEventHandler } from "react";
import type { Task } from "../types/task";
import TaskItem from "./TaskItem";

type FilterStatus = 'all' | 'completed' | 'incomplete';

const TasksList = () => {
    const localTasks : Task[] = JSON.parse(window.localStorage.getItem('tasks') ?? '[]');
    const [tasks, setTasks] = useState<Task[]>(localTasks ?? []);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [searchText, setSearchText] = useState('');
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleEdit = (id: string) => {
        setCurrentTask(tasks.filter(item => item.id === id)[0])
        dialogRef?.current?.showModal();
    };

    const handleComplete = (id: string) => {
        handleListUpdate(tasks.map(item => { return item.id === id ? { ...item, completed: !item.completed } : item }));
    }

    const handleRemove = (id: string) => {
        handleListUpdate(tasks.filter(item => item.id !== id));
    };

    const handleSave :SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if(!currentTask) {
            return;
        }

        const updatedList = !currentTask.id
            ? [...tasks, { ...currentTask, id: crypto.randomUUID() }]
            : tasks.map(item => { return item.id === currentTask.id ? currentTask : item })
       
        handleListUpdate(updatedList);
        handleDialogClose();
    };

    const handleTextSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    } 

    const handleCurrentTask = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setCurrentTask((prev) => ({
            ...(prev ?? {
                id: "",
                title: "",
                description: "",
                createdAt: new Date(),
                completed: false,
            }),
            [name]: value,
        }));
    }

    const handleDialogClose = () => {
        setCurrentTask(null);
        dialogRef?.current?.close();
    }

    const handleListUpdate = (updatedList: Task[]) => {
        setTasks(updatedList);
        window.localStorage.setItem('tasks', JSON.stringify(updatedList)); 
    }

    const textToFilter = searchText.trim().toLocaleLowerCase(); 

    const filteredTasks = tasks.filter(item => {
        const filteredStatus = filterStatus === 'completed' 
            ? item.completed
            : filterStatus === 'incomplete' 
                ? !item.completed
                : true;   
        
        const filteredText = textToFilter === ''
            || item.title.toLocaleLowerCase().includes(textToFilter)
            || item.description.toLocaleLowerCase().includes(textToFilter)

        return filteredStatus && filteredText
    });
 
    return (
        <>
            <section>
                <nav className="navbar">
                    <h1>To-do List</h1>
                    <button className="button" onClick={() => dialogRef.current?.showModal()}>
                        Add new Task
                    </button>
                </nav>
                
                <div className="filters-list">
                    <div className="select-wrapper">
                        <label>
                            Filter by:
                        </label>
                        <select 
                            name="status"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                        >
                            <option value="">All</option>
                            <option value="completed">Complete</option>
                            <option value="incomplete">Incomplete</option>
                        </select>
                    </div>
                    <div className="input-wrapper">
                        <label>
                            Search:
                        </label>
                        <input type="text" name="search" placeholder="Title or description..." onChange={handleTextSearch} value={searchText} />
                    </div>
                </div>

                <ul className="tasks-list">
                    { filteredTasks.map(item => ( 
                        <TaskItem 
                            key={item.id}
                            data={item}
                            onComplete={handleComplete}
                            onEdit={handleEdit}
                            onRemove={handleRemove} 
                        />
                     ))}
                </ul>
                
                <dialog ref={dialogRef}>
                    <div className="dialog">
                        <h2>{currentTask?.id ? 'Edit' : 'Add new'} Task</h2>
                        <form onSubmit={handleSave}>
                            <div>
                                <label>
                                    Title <br />
                                    <input type="text" name="title" value={currentTask?.title ?? ""} onChange={handleCurrentTask} />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Description <br />
                                    <input type="text" name="description" value={currentTask?.description ?? ""} onChange={handleCurrentTask} />
                                </label>
                            </div>
                            <button className="button" type="submit">
                                Save
                            </button>
                        </form>

                        <button className="close-button" onClick={handleDialogClose}>
                            X
                        </button>
                    </div>
                </dialog>
            </section>    
        </>
    );
}

export default TasksList;