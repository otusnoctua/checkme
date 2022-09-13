import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "./Loading";

function ResultList() {
    const [results, error] = useFetch('/results');
    const navigate = useNavigate();

    if (!results) {
        return <Loading description='Получаем ваши решения'/>
    }

    return(
        <div>
            <h2> Решения </h2> 
            {results.map((result) => {
                return (
                    <div onClick={() => navigate(`/results/${result._id}`)} className="block">
                        <div className=""> {result.task.name} </div>
                        {result.status} - {(new Date(result.date)).toLocaleTimeString()}
                    </div>
                )
            })}
        </div>
    )
}

export default ResultList;
