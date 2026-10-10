import type { Task } from "../types/task";

type TaskItemProps = {
    data: Task;
    onComplete: (id: string) => void;
    onEdit: (id: string) => void;
    onRemove: (id: string) => void;
}

const TaskItem = ({ 
    data, 
    onComplete, 
    onEdit, 
    onRemove 
}: TaskItemProps) => {

    return (
        <li className="task-item">
            <input type="checkbox" checked={data.completed} onChange={() => onComplete(data.id)} />
            <div className="content-wrapper">
                <div className="content">
                    <h3>{data.title}</h3>
                    <p>{data.description}</p>
                    <div className="buttons-list">
                        <button onClick={() => onEdit(data.id)}>Edit</button>
                        <button onClick={() => onRemove(data.id)}>Remove</button> 
                    </div>
                </div>
                
            </div>
        </li>
    )
}

export default TaskItem;