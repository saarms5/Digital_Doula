import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import ChatScreen from './ChatScreen';
import WeeklyUpdateScreen from './WeeklyUpdateScreen';
import PartnerCardScreen from './PartnerCardScreen';
import GoBagScreen from './GoBagScreen';

interface TimelineEvent {
    id: number;
    title: string;
    description: string;
    week_start: number;
    week_end: number;
    is_completed: boolean;
    category: string;
    details?: string;
    normal_values?: string;
}

interface TimelineScreenProps {
    userId: number;
    currentWeek: number;
}

export default function TimelineScreen({ userId, currentWeek }: TimelineScreenProps) {
    const [view, setView] = useState<'timeline' | 'chat' | 'weekly' | 'partner' | 'gobag'>('timeline');
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

    useEffect(() => {
        fetchTimeline();
    }, [userId]);

    const fetchTimeline = async () => {
        try {
            // Replace with your actual local IP
            const API_URL = `http://10.100.102.22:8000/timeline/${userId}`;
            const response = await fetch(API_URL);
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: TimelineEvent }) => {
        const isPast = currentWeek > item.week_end;
        const isCurrent = currentWeek >= item.week_start && currentWeek <= item.week_end;
        const isFuture = currentWeek < item.week_start;

        let statusColor = '#ccc'; // Future
        if (isCurrent) statusColor = '#6C63FF'; // Active
        if (isPast) statusColor = '#4CAF50'; // Completed/Past

        const isExpanded = expandedEventId === item.id;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setExpandedEventId(isExpanded ? null : item.id)}
                style={[styles.card, { borderLeftColor: statusColor, borderLeftWidth: 5 }]}
            >
                <View style={styles.header}>
                    <Text style={styles.weekRange}>Weeks {item.week_start}-{item.week_end}</Text>
                    <View style={[styles.badge, { backgroundColor: getCategoryColor(item.category) }]}>
                        <Text style={styles.badgeText}>{item.category}</Text>
                    </View>
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>

                {isExpanded && (item.details || item.normal_values) && (
                    <View style={styles.detailsContainer}>
                        {item.details && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>What is it?</Text>
                                <Text style={styles.detailText}>{item.details}</Text>
                            </View>
                        )}
                        {item.normal_values && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>Normal Values:</Text>
                                <Text style={styles.detailText}>{item.normal_values}</Text>
                            </View>
                        )}
                    </View>
                )}

                {isCurrent && (
                    <View style={styles.activeTag}>
                        <Text style={styles.activeTagText}>HAPPENING NOW</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Medical': return '#FF6584';
            case 'Test': return '#4DB6AC';
            case 'Vaccine': return '#FFD54F';
            case 'Lifestyle': return '#9575CD';
            default: return '#ccc';
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />;
    }

    if (view === 'chat') {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => setView('timeline')}>
                        <Text style={styles.navText}>← Back to Timeline</Text>
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>Antigravity Chat</Text>
                    <View style={{ width: 50 }} />
                </View>
                <ChatScreen userId={userId} />
            </View>
        );
    }

    if (view === 'weekly') {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => setView('timeline')}>
                        <Text style={styles.navText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>Weekly Download</Text>
                    <View style={{ width: 50 }} />
                </View>
                <WeeklyUpdateScreen currentWeek={currentWeek} />
            </View>
        );
    }

    if (view === 'partner') {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => setView('timeline')}>
                        <Text style={styles.navText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>Partner Card</Text>
                    <View style={{ width: 50 }} />
                </View>
                <PartnerCardScreen />
            </View>
        );
    }

    if (view === 'gobag') {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => setView('timeline')}>
                        <Text style={styles.navText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>Go Bag</Text>
                    <View style={{ width: 50 }} />
                </View>
                <GoBagScreen />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Your Medical Timeline</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={[styles.chatButton, { marginRight: 10, backgroundColor: '#FF6584' }]} onPress={() => setView('weekly')}>
                        <Text style={styles.chatButtonText}>This Week</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chatButton} onPress={() => setView('chat')}>
                        <Text style={styles.chatButtonText}>Ask AI</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.quickLinks}>
                <TouchableOpacity style={styles.linkButton} onPress={() => setView('partner')}>
                    <Text style={styles.linkText}>Partner Card</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkButton} onPress={() => setView('gobag')}>
                    <Text style={styles.linkText}>Go Bag</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={events}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40, // Increased for status bar
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 10,
        color: '#333',
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    weekRange: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
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
        lineHeight: 20,
    },
    activeTag: {
        marginTop: 10,
        backgroundColor: '#E8EAF6',
        padding: 5,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    activeTagText: {
        color: '#3F51B5',
        fontSize: 12,
        fontWeight: 'bold',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20,
    },
    chatButton: {
        backgroundColor: '#6C63FF',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    chatButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    navText: {
        color: '#6C63FF',
        fontSize: 16,
    },
    navTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerButtons: {
        flexDirection: 'row',
    },
    quickLinks: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    linkButton: {
        marginRight: 15,
        paddingVertical: 5,
    },
    linkText: {
        color: '#666',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    detailsContainer: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    detailSection: {
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 4,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});
