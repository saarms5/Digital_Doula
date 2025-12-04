import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

interface WeeklyUpdateProps {
    currentWeek: number;
}

export default function WeeklyUpdateScreen({ currentWeek }: WeeklyUpdateProps) {
    // In a real app, this data would come from the backend based on the week
    const getWeeklyContent = (week: number) => {
        // Placeholder content logic
        const size = "Lemon";
        const babyDev = "Fingerprints are forming.";
        const momBody = "You might be feeling more energy as you enter the second trimester.";

        return { size, babyDev, momBody };
    };

    const content = getWeeklyContent(currentWeek);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Week {currentWeek}</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Baby Status</Text>
                <View style={styles.row}>
                    <View style={styles.iconPlaceholder} />
                    <View style={styles.textContainer}>
                        <Text style={styles.highlight}>Size of a {content.size}</Text>
                        <Text style={styles.bodyText}>{content.babyDev}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Mom's Body</Text>
                <Text style={styles.bodyText}>{content.momBody}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>This Week's Checklist</Text>
                <Text style={styles.bodyText}>• Check your Timeline for upcoming appointments.</Text>
                <Text style={styles.bodyText}>• Stay hydrated!</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFD54F',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    highlight: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6C63FF',
        marginBottom: 5,
    },
    bodyText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
});
