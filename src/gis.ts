const EARTH_RADIUS: number = 6371e3; //meters

/**
 * @param {Array} start Expected [lon, lat]
 * @param {Array} end Expected [lon, lat]
 * @return {number} Distance in meters.
 */
export const calculateDistance = (
  start: Array<number>,
  end: Array<number>
): number => {
  const lat1 = start[1],
    lon1 = start[0],
    lat2 = end[1],
    lon2 = end[0];

  return sphericalCosinus(lat1, lon1, lat2, lon2);
};

/**
 * @param {number} lat1 Start Latitude
 * @param {number} lon1 Start Longitude
 * @param {number} lat2 End Latitude
 * @param {number} lon2 End Longitude
 * @return {number} Distance in meters.
 */
const sphericalCosinus = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  let dLon = toRad(lon2 - lon1),
    distance =
      Math.acos(
        Math.sin(lat1) * Math.sin(lat2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon)
      ) * EARTH_RADIUS;

  lat1 = toRad(lat1);
  lat2 = toRad(lat2);
  return distance;
};

/**
 * @param {Array} coord Expected [lon, lat]
 * @param {number} bearing Bearing in degrees.
 * 0° - North
 * 90° - East
 * 180° - South
 * 270° - West
 * @param {number} distance Distance in meters
 * @return {Array} Lon-lat coordinates.
 */
export const coordMetersAway = (
  coord: Array<number>,
  bearing: number,
  distance: number
): Array<number> => {
  /**
   * φ is latitude, λ is longitude,
   * θ is the bearing (clockwise from north),
   * δ is the angular distance d/R;
   * d being the distance travelled, R the earth’s radius*
   **/
  const δ = Number(distance) / EARTH_RADIUS; // angular distance in radians
  const θ = toRad(Number(bearing));
  const φ1 = toRad(coord[1]);
  const λ1 = toRad(coord[0]);

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
  );

  let λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );
  // normalise to -180..+180°
  λ2 = ((λ2 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;

  return [toDeg(λ2), toDeg(φ2)];
};

/**
 * @param {Array} start Expected [lon, lat]
 * @param {Array} end Expected [lon, lat]
 * @return {number} Bearing in degrees.
 */
export const getBearing = (
  start: Array<number>,
  end: Array<number>
): number => {
  let startLat = toRad(start[1]),
    startLong = toRad(start[0]),
    endLat = toRad(end[1]),
    endLong = toRad(end[0]),
    dLong = endLong - startLong;

  const dPhi = Math.log(
    Math.tan(endLat / 2.0 + Math.PI / 4.0) /
      Math.tan(startLat / 2.0 + Math.PI / 4.0)
  );

  if (Math.abs(dLong) > Math.PI) {
    dLong = dLong > 0.0 ? -(2.0 * Math.PI - dLong) : 2.0 * Math.PI + dLong;
  }

  return (toDeg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
};

const toDeg = (n: number): number => (n * 180) / Math.PI;

const toRad = (n: number): number => (n * Math.PI) / 180;
