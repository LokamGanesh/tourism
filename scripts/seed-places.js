const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jharkhand-tourism';

const places = [
    {
        name: 'Betla National Park',
        location: 'Latehar District, Jharkhand',
        description: 'Betla National Park is one of the earliest National Parks of India, famous for its Royal Bengal Tigers, Asian Elephants, and diverse wildlife. The park showcases the rich biodiversity of the Palamau region.',
        category: 'Wildlife',
        rating: 4.6,
        reviews: 1234,
        bestTime: 'October to March',
        entryFee: '₹50 for Indians, ₹200 for foreigners',
        timings: '6:00 AM - 6:00 PM',
        images: [
            'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80', // Tiger
            'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1200&q=80', // Wildlife
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80', // Forest
        ],
        coordinates: [23.8859, 84.1917],
        highlights: ['Royal Bengal Tigers', 'Asian Elephants', 'Leopards', 'Bird Watching'],
        facilities: ['Safari Jeeps', 'Forest Rest House', 'Canteen', 'Guide Services'],
        howToReach: 'Nearest railway station is Daltonganj (25 km). Regular buses available from Ranchi (170 km).',
        weather: { summer: '25°C - 40°C', winter: '10°C - 25°C', monsoon: '20°C - 30°C' },
        featured: true
    },
    {
        name: 'Hundru Falls',
        location: 'Ranchi, Jharkhand',
        description: 'The 34th highest waterfall in India, Hundru Falls is created on the course of the Subarnarekha River, where it falls from a height of 98 meters (322 ft). The spectacular scene of water falling from such a great height has been described as a sight to behold.',
        category: 'Waterfall',
        rating: 4.4,
        reviews: 856,
        bestTime: 'July to February',
        entryFee: '₹20 per person',
        timings: '6:00 AM - 6:00 PM',
        images: [
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80', // Waterfall
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', // Cascade
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'  // Pool
        ],
        coordinates: [23.4315, 85.4578],
        highlights: ['98m High Waterfall', 'Natural Swimming Pool', 'Picnic Spots', 'Photography'],
        facilities: ['Parking', 'Food Stalls', 'Rest Areas', 'Safety Guards'],
        howToReach: '45 km from Ranchi city center. Regular buses and taxis available.',
        weather: { summer: '20°C - 35°C', winter: '8°C - 22°C', monsoon: '18°C - 28°C' },
        featured: true
    },
    {
        name: 'Jagannath Temple',
        location: 'Ranchi, Jharkhand',
        description: 'Built by king of Barkagarh Jagannathpur Thakur Ani Nath Shahdeo, during 1691. Completed on Christmas 1691. It is located about 10 km from the main town. The temple is on top of a small hillock.',
        category: 'Religious',
        rating: 4.7,
        reviews: 2341,
        bestTime: 'Year round',
        entryFee: 'Free',
        timings: '5:00 AM - 9:00 PM',
        images: [
            'https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&w=1200&q=80', // Temple
            'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', // Architecture
            'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'  // Complex
        ],
        coordinates: [23.3441, 85.3096],
        highlights: ['17th Century Architecture', 'Rath Yatra Festival', 'Hilltop View', 'Peaceful Atmosphere'],
        facilities: ['Parking', 'Prasad Counter', 'Shoe Stand', 'Rest Areas'],
        howToReach: 'Located in Ranchi city center. Well connected by roads and public transport.',
        weather: { summer: '22°C - 38°C', winter: '10°C - 25°C', monsoon: '20°C - 30°C' },
        featured: true
    },
    {
        name: 'Netarhat',
        location: 'Latehar District, Jharkhand',
        description: 'Known as the "Queen of Chotanagpur", Netarhat is a hill station in Latehar district. It is famous for its glorious sunrises and sunsets during the summer months.',
        category: 'Hill Station',
        rating: 4.5,
        reviews: 967,
        bestTime: 'October to February',
        entryFee: 'Free',
        timings: 'All day',
        images: [
            'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?auto=format&fit=crop&w=1200&q=80', // Hills
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80', // Sunrise
            'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80'  // Forest
        ],
        coordinates: [23.4667, 84.2667],
        highlights: ['Sunrise View', 'Sunset Point', 'Pine Forests', 'Magnolia Point'],
        facilities: ['Hotels', 'Restaurants', 'Camping Sites', 'Trekking Guides'],
        howToReach: '156 km from Ranchi. Regular buses available from Ranchi and Daltonganj.',
        weather: { summer: '15°C - 30°C', winter: '5°C - 20°C', monsoon: '12°C - 25°C' },
        featured: true
    },
    {
        name: 'Deoghar Temple',
        location: 'Deoghar, Jharkhand',
        description: 'Baidyanath Jyotirlinga temple, also known as Baba Baidyanath dham and Baidyanath dham is one of the twelve Jyotirlingas, the most sacred abodes of Shiva.',
        category: 'Religious',
        rating: 4.8,
        reviews: 3456,
        bestTime: 'October to March',
        entryFee: 'Free',
        timings: '4:00 AM - 9:00 PM',
        images: [
            'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', // Sacred
            'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1200&q=80', // Interior
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80'  // Crowd
        ],
        coordinates: [24.4833, 86.7000],
        highlights: ['Jyotirlinga Temple', 'Shravani Mela', 'Spiritual Energy', 'Ancient History'],
        facilities: ['Accommodation', 'VIP Darshan', 'Medical Aid', 'Lost & Found'],
        howToReach: 'Well connected by rail and road. Deoghar and Jasidih are nearest railway stations.',
        weather: { summer: '25°C - 40°C', winter: '10°C - 25°C', monsoon: '22°C - 32°C' },
        featured: true
    }
];

async function seedPlaces() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Define Place Schema inline to avoid module issues in script
        const PlaceSchema = new mongoose.Schema({
            name: String,
            location: String,
            description: String,
            category: String,
            rating: Number,
            reviews: Number,
            bestTime: String,
            entryFee: String,
            timings: String,
            images: [String],
            coordinates: [Number],
            highlights: [String],
            facilities: [String],
            howToReach: String,
            weather: {
                summer: String,
                winter: String,
                monsoon: String
            },
            featured: Boolean
        });

        const Place = mongoose.models.Place || mongoose.model('Place', PlaceSchema);

        console.log('Deleting existing places...');
        await Place.deleteMany({});

        console.log('Seeding new places...');
        await Place.insertMany(places);

        console.log(`✅ Successfully added ${places.length} places with proper images`);

        await mongoose.disconnect();
        console.log('Disconnected');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding places:', error);
        process.exit(1);
    }
}

seedPlaces();
