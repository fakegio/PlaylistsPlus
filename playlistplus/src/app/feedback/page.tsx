"use client"
import { useState } from 'react';
import '../globals.css'

export default function Feedback() {
    const [form, setForm] = useState({name: "", email: "", feedback: ""});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm((prevForm) => ({...prevForm, [name]: value}))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert("Thank you for submitting");
    }

    return (
        <main className="flex min-h-screen flex-col justify-between items-center p-24">
            <h1 className="text-xl font-bold text-slate-100">Feedback Form</h1>
            <form className="justify-between" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="justify-center">
                        <label className="block text-left font-medium text-slate-300" htmlFor="name">Name:</label>
                        <input
                        className="text-gray-50 bg-gray-700 rounded-lg border border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        type="text"
                        id="name"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="justify-center">
                        <label className="block text-left font-medium text-slate-300" htmlFor="email">Email Address:</label>
                        <input
                        className="text-gray-50 bg-gray-700 rounded-lg border border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        type="email"
                        id="email"
                        required
                        placeholder="johndoe@email.com"
                        value={form.email}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="justify-center">
                    <label className="block text-left font-medium text-slate-300" htmlFor="feedback">Feedback:</label>
                    <textarea
                    className="block w-3/4 text-gray-50 bg-gray-700 rounded-lg border border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    id="feedback"
                    rows={5}
                    required
                    placeholder="Leave your feedback here..."
                    value={form.feedback}
                    onChange={handleChange}
                    />
                </div>
                <input className="text-white bg-blue-700 rounded-lg text-center font-medium hover:bg-blue-850 focus:ring-blue-300 focus:outline-none" type="submit" />
            </form>
        </main>
  )
}