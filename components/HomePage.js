"use client"; // Marking this component as a client component

import { useState, useEffect } from 'react';

export default function HomePage() {
    const [username, setUsername] = useState('');
    const [description, setDescription] = useState(''); // New state for description
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState([]);
    const [status, setStatus] = useState('');

    const enterQueue = async () => {
        setLoading(true);
        setStatus('');

        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
            });
            const data = await response.json();
            const newEntry = { id: data.userId, username, description, status: 'in queue' };
            setEntries(prevEntries => [...prevEntries, newEntry]);
            setUserId(data.userId);
            setStatus('You have entered the queue!');
            setUsername(''); // Clear the username input
            setDescription(''); // Clear the description input
        } catch (error) {
            setStatus('Error entering the queue.');
        } finally {
            setLoading(false);
        }
    };

    const markReady = (id) => {
        setEntries(prevEntries => 
            prevEntries.map(entry => 
                entry.id === id ? { ...entry, status: 'ready' } : entry
            )
        );
    };

    const removeTicket = (id) => {
        setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
        if (userId === id) {
            setUserId(null); // Clear the current user ID if they are removed
        }
    };

    // Keyboard event handler
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && username) {
            enterQueue();
        }
        if (event.key === 'r' || event.key === 'R') {
            // Remove the first ticket in the queue if one exists
            if (entries.length > 0) {
                removeTicket(entries[0].id);
            }
        }
    };

    // Attach event listener on mount
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [username, entries]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
            <h1 className="text-4xl font-bold mb-6">DJ's Interaction Queue</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="border border-gray-300 rounded p-2 mb-2 w-1/2"
                required
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="border border-gray-300 rounded p-2 mb-2 w-1/2"
                required
            />
            <button 
                onClick={enterQueue} 
                disabled={loading || !username || !description}
                className={`bg-blue-500 text-white rounded p-2 w-1/2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Entering...' : 'Enter Queue'}
            </button>
            {userId && (
                <div className="mt-4">
                    <h2 className="text-xl">Your ID: {userId}</h2>
                    <p className="text-gray-600">{status}</p>
                </div>
            )}
            {entries.length > 0 && (
                <table className="mt-6 min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 border">User ID</th>
                            <th className="py-2 px-4 border">Username</th>
                            <th className="py-2 px-4 border">Description</th> {/* New description column */}
                            <th className="py-2 px-4 border">Status</th>
                            <th className="py-2 px-4 border">Action</th>
                            <th className="py-2 px-4 border">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map(entry => (
                            <tr key={entry.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border">{entry.id}</td>
                                <td className="py-2 px-4 border">{entry.username}</td>
                                <td className="py-2 px-4 border">{entry.description}</td> {/* Display description */}
                                <td className="py-2 px-4 border">{entry.status}</td>
                                <td className="py-2 px-4 border">
                                    {entry.status === 'in queue' && (
                                        <button 
                                            onClick={() => markReady(entry.id)} 
                                            className="bg-green-500 text-white rounded p-1"
                                        >
                                            Ready
                                        </button>
                                    )}
                                </td>
                                <td className="py-2 px-4 border">
                                    <button 
                                        onClick={() => removeTicket(entry.id)} 
                                        className="bg-red-500 text-white rounded p-1"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
