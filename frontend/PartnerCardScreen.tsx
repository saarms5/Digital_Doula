import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function PartnerCardScreen() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Partner Card</Text>
            <Text style={styles.subHeader}>3 things you can do today to help:</Text>

            <View style={styles.card}>
                <Text style={styles.number}>1</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Litter Box Duty</Text>
                    <Text style={styles.description}>Toxoplasmosis risk is real. Please take over this chore entirely.</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.number}>2</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Foot Rub</Text>
                    <Text style={styles.description}>Edema (swelling) is common. A 5-minute foot rub helps circulation.</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.number}>3</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Hydration Patrol</Text>
                    <Text style={styles.description}>Ensure she has a full water bottle within reach at all times.</Text>
                </View>
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
    },
    number: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2196F3',
        marginRight: 20,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
});
