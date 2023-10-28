"use client"
import { useState , useEffect} from 'react';
import '../globals.css'

export default function Feedback() {
    const [form, setForm] = useState({name: "", email: "", feedback: ""});
    const [backgroundColors, setBackgroundColors] = useState('');
    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm((prevForm) => ({...prevForm, [name]: value}))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert("Thank you for submitting");
    }
    useEffect(() => {
        const storedBackgroundColors = localStorage.getItem('selectedBackgroundColor');
        if (storedBackgroundColors) {
          setBackgroundColors(storedBackgroundColors);
        }
      }, [])
    let token = sessionStorage.getItem("access_token")
    /* verify theres a token at all times except for login screen */
    if(!token){
      window.location.href = "/"
    }

    return (
        <main className="flex min-h-screen flex-col justify-center items-center p-24" style={{ backgroundColor: backgroundColors, width: '100%', height: '100%' }}>
            <h1 className="text-3xl font-bold mb-10 text-slate-100">Feedback Form</h1>
            <form className="justify-between" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="justify-center mb-2">
                        <label className="block text-left font-medium text-slate-300 mb-1" htmlFor="name">Name:</label>
                        <input
                        className="p-2.5 w-full text-gray-50 bg-gray-700 rounded-lg border border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="justify-center">
                        <label className="block text-left font-medium text-slate-300 mb-1" htmlFor="email">Email Address:</label>
                        <input
                        className="p-2.5 w-full text-gray-50 bg-gray-700 rounded-lg border border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="johndoe@email.com"
                        value={form.email}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="justify-center">
                    <label className="block text-left font-medium text-slate-300 mb-1" htmlFor="feedback">Feedback:</label>
                    <textarea
                    className="block p-2.5 w-full text-gray-50 bg-gray-700 rounded-lg border border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    id="feedback"
                    name="feedback"
                    rows={5}
                    required
                    placeholder="Leave your feedback here..."
                    value={form.feedback}
                    onChange={handleChange}
                    />
                </div>
                <button className="px-4 py-2 text-white bg-blue-700 rounded-lg text-center font-medium hover:bg-blue-800 active:bg-blue-900 focus:ring focus:ring-blue-300 focus:outline-none mt-5" type="submit">Submit</button>
            </form>
        </main>
  )
}