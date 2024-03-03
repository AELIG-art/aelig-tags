import {defineConfig} from '@junobuild/config';
import { satelliteId } from "./src/utils/constants";

export default defineConfig({
  satellite: {
    satelliteId,
    source: 'build'
  }
});
