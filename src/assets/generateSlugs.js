import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(__dirname, "../content");

function getSlugInfo(filePath) {
  const relativePath = path.relative(contentDir, filePath);
  const parts = relativePath.split(path.sep); 

  if (parts.length < 3) return null; 

  const lang = parts[0]; // "ko"
  const category = parts[1]; // "kics"
  const slugWithExt = parts.pop(); // "233.mdx"
  const slug = slugWithExt.replace(".mdx", ""); // "233"
  const targetUrl = `/${lang}/${category}/${slug}`;
  const actualUrl = parts.slice(1).concat(slug).join("/"); 

  return {
    actualUrl,
    targetUrl,
    lang,
    category,
    slug,
  };
}

// 폴더 내 모든 MDX 파일 찾기
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith(".mdx")) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// 모든 파일 리스트 가져오기
const mdxFiles = getAllFiles(contentDir);

// 필요한 정보 추출
const slugData = mdxFiles.map((file) => getSlugInfo(file)).filter(Boolean);

// JSON 파일로 저장
fs.writeFileSync("public/slugData.json", JSON.stringify(slugData, null, 2));

console.log("✅ Slug 데이터 생성 완료!");