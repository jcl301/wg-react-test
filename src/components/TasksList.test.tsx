import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TasksList from "./TasksList";

beforeEach(() => {
    localStorage.clear();
});

it("renders empty list", () => {
    render(<TasksList />);

    expect(screen.getByText("To-do List")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
});

it('open the dialog when clicking "Add new Task" button', async () => {
    render(<TasksList />);
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.open).toBe(false);

    await userEvent.click(screen.getByRole("button", { name: "Add new Task" }));

    expect(dialog.open).toBe(true);
});

it("create the task and update the tasks list", async () => {
    render(<TasksList />);

    await userEvent.click(screen.getByRole("button", { name: "Add new Task" }));
    await userEvent.type(screen.getByLabelText("Title"), "New task");
    await userEvent.type(screen.getByLabelText("Description"), "Basic description");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("New task")).toBeInTheDocument();
});

it("update task status when clicking checkbox", async () => {
    localStorage.setItem("tasks", JSON.stringify([
        { id: "abc", title: "Tarefa X", description: "desc", createdAt: new Date().toISOString(), completed: false },
    ]));
    render(<TasksList />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();
});
