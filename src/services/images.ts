import * as FileSystem from 'expo-file-system/legacy';

/**
 * Convert a local file URI into a base64 data URI that the backend can store
 * directly in MongoDB and render with `<Image source={{ uri }} />`.
 */
export async function imageUriToDataUri(uri: string): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:image/jpeg;base64,${base64}`;
}
