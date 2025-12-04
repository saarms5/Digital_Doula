import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function GoBagScreen() {
    const [items, setItems] = useState([
        { id: 1, category: 'Essentials', text: 'ID & Insurance Card', checked: false },
        { id: 2, category: 'Essentials', text: 'Phone Charger (Long Cord)', checked: false },
        { id: 3, category: 'Essentials', text: 'Car Seat Installed', checked: false },
        { id: 4, category: 'Comfort', text: 'Robe & Slippers', checked: false },
        { id: 5, category: 'Comfort', text: 'Toiletries', checked: false },
        { id: 6, category: 'Comfort', text: 'Nursing Bra', checked: false },
        { id: 7, category: 'Comfort', text: 'Snacks', checked: false },
        { id: 8, category: 'Baby', text: 'Going Home Outfit', checked: false },
        { id: 9, category: 'Baby', text: 'Blanket', checked: false },
    ]);

    const toggleItem = (id: number) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const renderCategory = (category: string) => {
        return items.filter(i => i.category === category).map(item => (
            <TouchableOpacity key={item.id} style={styles.item} onPress={() => toggleItem(item.id)}>
                <View style={[styles.checkbox, item.checked && styles.checked]}>
                    {item.checked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.itemText, item.checked && styles.strikethrough]}>{item.text}</Text>
            </TouchableOpacity>
        ));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Hospital Bag</Text>
            <Text style={styles.subHeader}>Pack by Week 36</Text>

            <Text style={styles.categoryTitle}>Essentials</Text>
            {renderCategory('Essentials')}

            <Text style={styles.categoryTitle}>Comfort</Text>
            {renderCategory('Comfort')}

            <Text style={styles.categoryTitle}>Baby</Text>
            {renderCategory('Baby')}
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
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF6584',
        marginTop: 10,
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#ccc',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    checkmark: {
        color: '#fff',
        fontWeight: 'bold',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    strikethrough: {
        textDecorationLine: 'line-through',
        color: '#aaa',
    },
});
