export const translations = {
  en: {
    title: "SocialGen",
    ideaLabel: "What's your idea?",
    ideaPlaceholder: "e.g., Launching our new AI-powered analytics tool...",
    toneLabel: "Tone",
    tones: {
      Professional: "Professional",
      Witty: "Witty",
      Urgent: "Urgent",
      Inspirational: "Inspirational",
      Educational: "Educational"
    },
    imageQualityLabel: "Image Quality",
    imageQuality: {
      "1K": "1K (Standard)",
      "2K": "2K (High)",
      "4K": "4K (Ultra)"
    },
    generateBtn: "Generate Content",
    generatingBtn: "Drafting Content...",
    emptyState: "Enter an idea to generate your social media campaign.",
    postCopy: "Post Copy",
    generatedImage: "Generated Image",
    generatingImage: "Generating...",
    failedToLoad: "Failed to load",
    regenerateImage: "Regenerate Image",
    aspectRatios: {
      "1:1": "1:1 (Square)",
      "4:3": "4:3",
      "3:4": "3:4",
      "16:9": "16:9 (Landscape)",
      "9:16": "9:16 (Portrait)",
      "3:2": "3:2",
      "2:3": "2:3",
      "21:9": "21:9"
    },
    alertFailed: "Failed to generate content. Please try again.",
    language: "Language",
    platforms: {
      linkedin: "LinkedIn",
      twitter: "Twitter / X",
      instagram: "Instagram"
    }
  },
  zh: {
    title: "社交生成器",
    ideaLabel: "你的想法是什么？",
    ideaPlaceholder: "例如：发布我们全新的人工智能分析工具...",
    toneLabel: "语气",
    tones: {
      Professional: "专业",
      Witty: "风趣",
      Urgent: "紧迫",
      Inspirational: "鼓舞人心",
      Educational: "教育性"
    },
    imageQualityLabel: "图片质量",
    imageQuality: {
      "1K": "1K (标准)",
      "2K": "2K (高清)",
      "4K": "4K (超清)"
    },
    generateBtn: "生成内容",
    generatingBtn: "正在起草内容...",
    emptyState: "输入一个想法来生成你的社交媒体活动。",
    postCopy: "帖子文案",
    generatedImage: "生成的图片",
    generatingImage: "生成中...",
    failedToLoad: "加载失败",
    regenerateImage: "重新生成图片",
    aspectRatios: {
      "1:1": "1:1 (正方形)",
      "4:3": "4:3",
      "3:4": "3:4",
      "16:9": "16:9 (横向)",
      "9:16": "9:16 (纵向)",
      "3:2": "3:2",
      "2:3": "2:3",
      "21:9": "21:9"
    },
    alertFailed: "生成内容失败，请重试。",
    language: "语言",
    platforms: {
      linkedin: "领英 (LinkedIn)",
      twitter: "推特 (Twitter / X)",
      instagram: "照片墙 (Instagram)"
    }
  }
};

export type Language = keyof typeof translations;
