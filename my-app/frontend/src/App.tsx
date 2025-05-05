import axios from 'axios';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState
} from 'react';

interface Entry {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

type NewEntry = Omit<Entry, 'id'>;

const API_URL = import.meta.env.VITE_BACKEND_URL;

const getEntries = () => {
  return axios.get<Entry[]>(API_URL).then(res => res.data);
};

const saveNewEntry = (newEntry: NewEntry) => {
  return axios.post<Entry>(API_URL, newEntry).then(res => res.data);
};

const useInput = () => {
  const [value, setValue] = useState('');

  return {
    value: value,
    setValue: setValue,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
  };
};

const RadioSelector = ({
  selected,
  setSelected,
  possibilities,
  title
}: {
  title: string;
  selected: string;
  possibilities: string[];
  setSelected: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <fieldset>
      <legend>{title}</legend>
      {possibilities.map(p => (
        <div key={p}>
          <input
            type='radio'
            id={p}
            checked={selected === p}
            onChange={() => setSelected(p)}
          />
          <label htmlFor={p}>{p}</label>
        </div>
      ))}
    </fieldset>
  );
};

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [errorNote, setErrorNote] = useState('');

  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');

  const visibilities = ['great', 'good', 'ok', 'poor'];
  const weathers = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'];

  const dateInput = useInput();
  const commentInput = useInput();

  useEffect(() => {
    getEntries().then(entries => {
      setEntries(entries);
    });
  }, []);

  const notifyError = (message: string) => {
    setErrorNote(message);
    setTimeout(() => setErrorNote(''), 5000);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveNewEntry({
      date: dateInput.value,
      visibility: visibility,
      weather: weather,
      comment: commentInput.value
    })
      .then(e => {
        setEntries(entries.concat(e));
        setVisibility('')
        setWeather('')
        dateInput.setValue('')
        commentInput.setValue('')
      })
      .catch(error => {
        if (axios.isAxiosError(error)) {
          notifyError(error.response?.data);
        }
        console.error(error);
      });
  };

  return (
    <>
      <h1>Add new entry</h1>
      <div style={{ color: 'red' }}>{errorNote}</div>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input type='date' onChange={dateInput.onChange} value={dateInput.value} />
          <br />
        </label>

        <RadioSelector
          title='Weather: '
          possibilities={weathers}
          selected={weather}
          setSelected={setWeather}
        />

        <RadioSelector
          title='Visibility: '
          possibilities={visibilities}
          selected={visibility}
          setSelected={setVisibility}
        />

        <label>
          Comment:
          <input onChange={commentInput.onChange} value={commentInput.value} />
          <br />
        </label>
        <button>Add entry</button>
      </form>

      <h1>Diary entries</h1>
      <ul>
        {entries.map(e => (
          <li key={e.id} style={{ paddingBottom: '16px' }}>
            Date: {e.date} <br />
            Visibility: {e.visibility} <br />
            Weather: {e.weather} <br />
            Comment: {e.comment} <br />
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
