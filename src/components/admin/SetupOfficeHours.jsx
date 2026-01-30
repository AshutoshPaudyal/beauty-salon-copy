import React, { useState, useEffect } from "react";
import { Clock, Plus, Trash2, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";

// Mock API
const mockGetOfficeHours = async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
        start: "09:00 AM",
        end: "07:00 PM",
        slotDuration: 15,
        breaks: [
            { start: "02:00 PM", end: "05:00 PM" }
        ]
    };
};

const mockSaveOfficeHours = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("Saved Office Hours:", data);
    return { success: true };
};

export default function SetupOfficeHours() {
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [config, setConfig] = useState({
        start: "09:00",
        startPeriod: "AM",
        end: "05:00",
        endPeriod: "PM",
        breaks: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const parseTimeStr = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        return { time, period };
    };

    const loadData = async () => {
        try {
            const data = await mockGetOfficeHours();
            const start = parseTimeStr(data.start);
            const end = parseTimeStr(data.end);

            setConfig({
                start: start.time,
                startPeriod: start.period,
                end: end.time,
                endPeriod: end.period,
                breaks: data.breaks.map(b => ({
                    id: Date.now() + Math.random(),
                    start: parseTimeStr(b.start).time,
                    startPeriod: parseTimeStr(b.start).period,
                    end: parseTimeStr(b.end).time,
                    endPeriod: parseTimeStr(b.end).period,
                }))
            });
        } catch (error) {
            console.error("Failed to load office hours", error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMessage("");

        // Construct payload
        const payload = {
            start: `${config.start} ${config.startPeriod}`,
            end: `${config.end} ${config.endPeriod}`,
            breaks: config.breaks.map(b => ({
                start: `${b.start} ${b.startPeriod}`,
                end: `${b.end} ${b.endPeriod}`
            }))
        };

        try {
            await mockSaveOfficeHours(payload);
            setSuccessMessage("Office hours updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const addBreak = () => {
        setConfig(prev => ({
            ...prev,
            breaks: [
                ...prev.breaks,
                { id: Date.now(), start: "12:00", startPeriod: "PM", end: "01:00", endPeriod: "PM" }
            ]
        }));
    };

    const removeBreak = (id) => {
        setConfig(prev => ({
            ...prev,
            breaks: prev.breaks.filter(b => b.id !== id)
        }));
    };

    const updateBreak = (id, field, value) => {
        setConfig(prev => ({
            ...prev,
            breaks: prev.breaks.map(b => b.id === id ? { ...b, [field]: value } : b)
        }));
    };

    const TimeInput = ({ value, period, onTimeChange, onPeriodChange, label }) => (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm font-bold text-gray-500 ml-1">{label}</label>}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onTimeChange(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-muted-foreground text-sm"
                        placeholder="00:00"
                    />
                </div>
                <select
                    value={period}
                    onChange={(e) => onPeriodChange(e.target.value)}
                    className="px-3 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 font-bold text-muted-foreground text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-pink-50">
            <h2 className="text-2xl font-bold text-muted-foreground mb-8">Office Hours Configuration</h2>

            {successMessage && (
                <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-2 animate-in slide-in-from-top-2 border border-green-100">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* Working Hours Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-secondary">
                            <Clock className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Working Hours</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <TimeInput
                            label="Opening Time"
                            value={config.start}
                            period={config.startPeriod}
                            onTimeChange={(v) => setConfig({ ...config, start: v })}
                            onPeriodChange={(v) => setConfig({ ...config, startPeriod: v })}
                        />
                        <TimeInput
                            label="Closing Time"
                            value={config.end}
                            period={config.endPeriod}
                            onTimeChange={(v) => setConfig({ ...config, end: v })}
                            onPeriodChange={(v) => setConfig({ ...config, endPeriod: v })}
                        />
                    </div>
                </div>

                {/* Breaks Section */}
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                <Clock className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Breaks</h3>
                        </div>
                        <button
                            type="button"
                            onClick={addBreak}
                            className="flex items-center gap-2 text-xs font-bold text-secondary bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Break
                        </button>
                    </div>

                    <div className="space-y-4">
                        {config.breaks.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                                <p className="text-sm text-gray-400 italic">No breaks added yet.</p>
                            </div>
                        ) : (
                            config.breaks.map((blk, index) => (
                                <div key={blk.id} className="flex flex-col md:flex-row items-end md:items-center gap-4 p-4 bg-gray-50/30 border border-gray-100 rounded-[2rem] transition-all hover:border-pink-100 group">
                                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <TimeInput
                                            label={index === 0 ? "Start Time" : ""}
                                            value={blk.start}
                                            period={blk.startPeriod}
                                            onTimeChange={(v) => updateBreak(blk.id, 'start', v)}
                                            onPeriodChange={(v) => updateBreak(blk.id, 'startPeriod', v)}
                                        />
                                        <TimeInput
                                            label={index === 0 ? "End Time" : ""}
                                            value={blk.end}
                                            period={blk.endPeriod}
                                            onTimeChange={(v) => updateBreak(blk.id, 'end', v)}
                                            onPeriodChange={(v) => updateBreak(blk.id, 'endPeriod', v)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeBreak(blk.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer opacity-100 md:opacity-0 group-hover:opacity-100"
                                        title="Remove Break"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-secondary hover:bg-button-hover text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-pink-100 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Configuration
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
