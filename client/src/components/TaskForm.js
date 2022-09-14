import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import usePost from '../hooks/usePost';
import '../styles/TaskForm.css'
import AdminRequired from './AdminRequired';

/**
 * Component-form to send new task to server.
 * Available only for admin user
 */
function TaskForm() {
    let navigate = useNavigate();
    let [inputsValues, addInput] = useForm();
    let [criterions, setCriterions] = useState([]);
    let [answersFormat, setAnswersFormat] = useState(['answer1']);
    let taskPost = usePost(
        '/task/new', 
        (data) => navigate(`/task/${data.taskId}`)
    );

    useEffect(() => {
        try {
            setCriterions(parseCriterionsJson(inputsValues['criterionsJson']));
        } catch(e) {
            setCriterions([]);
        }
    }, [inputsValues['criterionsJson']])

    const onSubmit = () => {
        let formData = new FormData();
        formData.append('name', inputsValues['name']);
        formData.append('description', inputsValues['description']);
        formData.append('criterions', inputsValues['criterionsJson']);
        formData.append('answerFormat', JSON.stringify(
            answersFormat.map((answer) => {
                return { name: inputsValues[answer], type: inputsValues[`${answer}Type`] }
            })
        ));
        criterions.forEach((criterion) => {
            formData.append(criterion, inputsValues[criterion], criterion);
        });
        taskPost.fetch(formData);
    };

    const isFormDataReady = () => {
        const inputNames = criterions.concat(answersFormat, ['name', 'description', 'criterionsJson']); 
        return inputNames.every((input) => inputsValues[input]);
    };

    return (
        <AdminRequired>
            <h2> Создание задачи </h2>
            <h3> Название </h3>
            <input {...addInput('name')}/>
            <h3> Описание </h3>
            <input {...addInput('description')}/>
            <h3> Формат ответа </h3>
            {answersFormat.map((answer) => {
                return (
                    <div key={answer}>
                        <input {...addInput(answer)}/>
                        <select {...addInput(`${answer}Type`, null, 'text')}>
                            <option value='text'> Текст </option>
                            <option value='file'> Файл </option>
                        </select>
                    </div>
                )
            })}
            <button onClick={() => {setAnswersFormat((state) => [...state, `answer${state.length + 1}`])}}> 
                Добавить вопрос 
            </button>
            <h3> JSON с критериями задачи </h3>
            <textarea {...addInput('criterionsJson', null, '{\n  \n}')}/>
            <h3> Файлы тестов: </h3>
            {criterions.map((criterion) => {
                return (
                    <div key={criterion} className='criterionInputBox'> 
                        <div className='criterionName'>
                            {criterion}
                        </div>
                        <div className='criterionFileInput'>
                            <input {...addInput(criterion, 'file')}/>
                        </div>
                    </div>
                )
            })}
            <button disabled={!isFormDataReady()} onClick={onSubmit}> Отправить </button>
        </AdminRequired>
    )
}

function parseCriterionsJson(criterions) {
    let json = JSON.parse(criterions);
    let result = [];
    for (let data of Object.values(json)) {
        if (data.test) {
            result.push(data.test);
        }
    }
    return result;
}

export default TaskForm;
