/**
 * Calculate Qibla direction from user's location to Kaaba (Mecca)
 * @param userLat - User's latitude
 * @param userLon - User's longitude
 * @returns Qibla direction in degrees (0-360)
 */
export const calculateQiblaDirection = (
  userLat: number,
  userLon: number,
): number => {
  // Kaaba coordinates
  const kaabaLat = 21.4225;
  const kaabaLon = 39.826206;

  // Convert to radians
  const lat1 = (userLat * Math.PI) / 180;
  const lat2 = (kaabaLat * Math.PI) / 180;
  const dLon = ((kaabaLon - userLon) * Math.PI) / 180;

  // Calculate bearing
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = Math.atan2(y, x);

  // Convert to degrees
  bearing = (bearing * 180) / Math.PI;

  // Normalize to 0-360
  bearing = (bearing + 360) % 360;

  return bearing;
};
