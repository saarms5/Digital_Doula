import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import TimelineScreen from './TimelineScreen';

interface OnboardingResponse {
    user_id: number;
    due_date: string;
    current_week: number;
    current_day: number;
    message: string;
}

export default function OnboardingScreen() {
    const [name, setName] = useState('');
    const [isFirstPregnancy, setIsFirstPregnancy] = useState(true);
    const [dateMode, setDateMode] = useState<'LMP' | 'DueDate'>('LMP');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [highRiskFactors, setHighRiskFactors] = useState('');
    const [result, setResult] = useState<OnboardingResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }
        setLoading(true);
        try {
            // Replace with your actual local IP if running on device, or localhost for simulator
            // Android Emulator usually uses 10.0.2.2
            const API_URL = 'http://10.100.102.22:8000/onboarding';

            const payload = {
                name,
                is_first_pregnancy: isFirstPregnancy,
                high_risk_factors: highRiskFactors,
                [dateMode === 'LMP' ? 'last_menstrual_period' : 'due_date']: selectedDate.toISOString().split('T')[0]
            };

            console.log('Sending payload:', payload);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server Error:', response.status, errorText);
                alert(`Server Error: ${response.status}\n${errorText}`);
                return;
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Network Error:', error);
            alert(`Connection Error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        return (
            <TimelineScreen userId={result.user_id} currentWeek={result.current_week} />
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Digital Doula Setup</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>What should we call you?</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Is this your first pregnancy?</Text>
                <View style={styles.row}>
                    <Text>{isFirstPregnancy ? "Yes" : "No"}</Text>
                    <Switch value={isFirstPregnancy} onValueChange={setIsFirstPregnancy} />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Calculate by:</Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.button, dateMode === 'LMP' ? styles.activeButton : styles.inactiveButton]}
                        onPress={() => setDateMode('LMP')}
                    >
                        <Text style={styles.buttonText}>LMP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, dateMode === 'DueDate' ? styles.activeButton : styles.inactiveButton]}
                        onPress={() => setDateMode('DueDate')}
                    >
                        <Text style={styles.buttonText}>Due Date</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>
                    {dateMode === 'LMP' ? 'First day of last period:' : 'Your Due Date:'}
                </Text>

                {Platform.OS === 'android' && (
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                        <Text>{selectedDate.toDateString()}</Text>
                    </TouchableOpacity>
                )}

                {(showDatePicker || Platform.OS === 'ios') && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Any high risk factors? (Optional)</Text>
                <TextInput
                    style={styles.input}
                    value={highRiskFactors}
                    onChangeText={setHighRiskFactors}
                    placeholder="e.g. Twins, High BP"
                />
            </View>

            <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.submitButtonText}>{loading ? "Processing..." : "Start My Journey"}</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 5,
    },
    activeButton: {
        backgroundColor: '#6C63FF',
    },
    inactiveButton: {
        backgroundColor: '#ddd',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    dateButton: {
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#FF6584',
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: '#ccc',
        elevation: 0,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
