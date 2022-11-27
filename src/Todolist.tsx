import React, {ChangeEvent, memo, useCallback} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = memo((props: PropsType) => {

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id);
    }, [props.addTask, props.id])

    const removeTodolist = () => {
        props.removeTodolist(props.id);
    }
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.id, title);
    }

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), []);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), []);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), []);

    let tasksForTodolist = props.tasks

    if (props.filter === "active") {
        tasksForTodolist = tasksForTodolist.filter(t => t.isDone === false);
    }
    if (props.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter(t => t.isDone === true);
    }

    const removeTask = useCallback((taskId: string) => props.removeTask(taskId, props.id), [props.removeTask, props.id])
    const changeTaskStatus = useCallback((taskId: string, status: boolean) => {
        props.changeTaskStatus(taskId, status, props.id);
    }, [props.changeTaskStatus, props.id])
    const changeTaskTitle = useCallback((taskId: string, newValue: string) => {
        props.changeTaskTitle(taskId, newValue, props.id);
    }, [props.changeTaskTitle, props.id])


    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasksForTodolist.map(t => {

                    return <Task
                        key={t.id}
                        task={t}
                        removeTask={removeTask}
                        changeTaskTitle={changeTaskTitle}
                        changeTaskStatus={changeTaskStatus}
                    />
                })
            }
        </div>
        <div style={{paddingTop: "10px"}}>
            <ButtonExample titleButton="all"
                           onClickHandler={onAllClickHandler}
                           color={'inherit'}
                           filter={props.filter}
            />
            <ButtonExample titleButton="active"
                           onClickHandler={onActiveClickHandler}
                           color={'primary'}
                           filter={props.filter}
            />
            <ButtonExample titleButton="completed"
                           onClickHandler={onCompletedClickHandler}
                           color={'secondary'}
                           filter={props.filter}
            />
        </div>
    </div>
})

type ButtonExamplePropsType = {
    titleButton: FilterValuesType,
    onClickHandler: () => void
    color: 'inherit' | 'primary' | 'secondary'
    filter: string
}

const ButtonExample = memo((props: ButtonExamplePropsType) => {
    return <Button variant={props.titleButton === props.filter ? "outlined" : "text"}
                   onClick={props.onClickHandler}
                   color={props.color}>{props.titleButton}
    </Button>
})


