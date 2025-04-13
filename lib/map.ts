import { Driver, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

export const generateMarkersFromData = (
    {
        data,
        userLatitude,
        userLongitude,
    }: {
        data: Driver[];
        userLatitude: number;
        userLongitude: number;
    }
): MarkerData[] => {
    return data.map((driver) => {
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;

        return {
            latitude: userLatitude + latOffset,
            longitude: userLongitude + lngOffset,
            title: `${driver.first_name} ${driver.last_name}`,
            ...driver,
            id: Number(driver.id),
            rating: Number(driver.rating),
        };
    });
};


export const calculateRegion = (
    {
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
    }: {
    userLatitude: number | null;
    userLongitude: number | null;
    destinationLatitude?: number | null;
    destinationLongitude?: number | null;
}) => {
    if (!userLatitude || !userLongitude) {
        return {
            latitude: 38.424149,
            longitude: 27.143148,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    if (!destinationLatitude || !destinationLongitude) {
        return {
            latitude: userLatitude,
            longitude: userLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    const minLat = Math.min(userLatitude, destinationLatitude);
    const maxLat = Math.max(userLatitude, destinationLatitude);
    const minLng = Math.min(userLongitude, destinationLongitude);
    const maxLng = Math.max(userLongitude, destinationLongitude);

    const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
    const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

    const latitude = (userLatitude + destinationLatitude) / 2;
    const longitude = (userLongitude + destinationLongitude) / 2;

    return {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
    };
};

export const calculateDriverTimes = async ({
                                               markers,
                                               userLatitude,
                                               userLongitude,
                                               destinationLatitude,
                                               destinationLongitude,
                                           }: {
    markers: MarkerData[];
    userLatitude: number | null;
    userLongitude: number | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
}) => {
    if (
        !userLatitude ||
        !userLongitude ||
        !destinationLatitude ||
        !destinationLongitude
    )
        return;

    try {
        const timesPromises = markers.map(async (marker) => {
            try {
                // Fetch from driver to user
                const res1 = await fetch(
                    `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`
                );
                const dataToUser = await res1.json();

                if (
                    dataToUser.status !== "OK" ||
                    !dataToUser.routes?.[0]?.legs?.[0]
                ) {
                    console.warn("Directions to user failed:", dataToUser);
                    return null; // Skip this marker
                }

                const timeToUser = dataToUser.routes[0].legs[0].duration.value;

                // Fetch from user to destination
                const res2 = await fetch(
                    `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`
                );
                const dataToDestination = await res2.json();

                if (
                    dataToDestination.status !== "OK" ||
                    !dataToDestination.routes?.[0]?.legs?.[0]
                ) {
                    console.warn("Directions to destination failed:", dataToDestination);
                    return null; // Skip this marker
                }

                const timeToDestination =
                    dataToDestination.routes[0].legs[0].duration.value;

                const totalTime = (timeToUser + timeToDestination) / 60;
                const price = (totalTime * 0.5).toFixed(2);

                return {
                    ...marker,
                    time: totalTime,
                    price,
                };
            } catch (innerError) {
                console.error("Error with one marker:", innerError);
                return null;
            }
        });

        const results = await Promise.all(timesPromises);
        return results.filter(Boolean); // remove nulls
    } catch (error) {
        console.error("Error calculating driver times:", error);
        return [];
    }
};
