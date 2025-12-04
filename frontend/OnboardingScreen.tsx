import TimelineScreen from './TimelineScreen';

// ... (imports remain same)

export default function OnboardingScreen() {
    // ... (state remains same)

    if (result) {
        return (
            <TimelineScreen userId={result.user_id} currentWeek={result.current_week} />
        );
    }

    // ... (rest of the component)


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

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Start My Journey</Text>
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
    subtitle: {
        fontSize: 20,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
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
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 16,
        color: '#555',
    },
});
