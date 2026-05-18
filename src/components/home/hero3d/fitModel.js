import * as THREE from 'three';

/**
 * Scale mesh into the headY → baseY band.
 * widthWeight / depthWeight tune fit per pose (killshot hand-forward is wider).
 */
export function fitModelToFrame(
  root,
  {
    offsetX = 0.12,
    headY = 1.06,
    baseY = -0.9,
    viewScale = 1,
    widthWeight = 0.45,
    depthWeight = 0.82,
  } = {}
) {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  root.position.sub(center);

  const span = headY - baseY;
  const fitExtent = Math.max(size.y, size.z * depthWeight, size.x * widthWeight);
  const scale = (span / Math.max(fitExtent, 0.001)) * viewScale;
  root.scale.multiplyScalar(scale);

  const fitted = new THREE.Box3().setFromObject(root);
  root.position.y += headY - fitted.max.y;
  root.position.x += offsetX;

  return { scale, size, center, span };
}
