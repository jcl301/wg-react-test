import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskItem from "./TaskItem";
import type { Task } from "../types/task";

const baseTask: Task = {
    id: "1",
    title: "Buy chocolate",
    description: "Store",
    createdAt: new Date(),
    completed: false,
};

it("render title and description", () => {
    render(<TaskItem data={baseTask} onComplete={vi.fn()} onEdit={vi.fn()} onRemove={vi.fn()} />);

    expect(screen.getByText("Buy chocolate")).toBeInTheDocument();
    expect(screen.getByText("Store")).toBeInTheDocument();
});

it("update completed no checkbox", () => {
    const { rerender } = render(
        <TaskItem data={baseTask} onComplete={vi.fn()} onEdit={vi.fn()} onRemove={vi.fn()} />
    );
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    rerender(
        <TaskItem data={{ ...baseTask, completed: true }} onComplete={vi.fn()} onEdit={vi.fn()} onRemove={vi.fn()} />
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
});

it("call onComplete when clicking checkbox", async () => {
    const onComplete = vi.fn();
    render(<TaskItem data={baseTask} onComplete={onComplete} onEdit={vi.fn()} onRemove={vi.fn()} />);

    await userEvent.click(screen.getByRole("checkbox"));

    expect(onComplete).toHaveBeenCalledWith("1");
});

it("chama onEdit and onRemove", async () => {
    const onEdit = vi.fn();
    const onRemove = vi.fn();
    render(<TaskItem data={baseTask} onComplete={vi.fn()} onEdit={onEdit} onRemove={onRemove} />);

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(onEdit).toHaveBeenCalledWith("1");
    expect(onRemove).toHaveBeenCalledWith("1");
});
