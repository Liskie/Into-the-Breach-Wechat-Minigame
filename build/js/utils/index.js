/**
 * 工具函数
 */
// 导出屏幕像素比，屏幕宽度和高度
export const { pixelRatio, screenWidth, screenHeight } = wx.getSystemInfoSync();
/**
 * 与标准设计稿相比，当然屏幕的 缩放比
 * @param width
 * @param height
 * @returns
 */
export const getScale = (width, height) => {
    let scale = 1;
    const designWidth = 375;
    const designHeight = 667;
    const designRatio = designWidth / designHeight;
    const viewRatio = width / height;
    // 根据设计稿的宽高比与视口的宽高比判断缩放的基准
    if (designRatio > viewRatio) {
        // 以宽为基准做缩放
        scale = width / designWidth;
    }
    else {
        // 以高为基准做缩放
        scale = height / designHeight;
    }
    return scale;
};
export const getZoom = (width, height) => {
    // 相机的缩放比
    let zoom = 1;
    // 背景区缩放以后的左上角x坐标
    let bgX = 0;
    // 背景区缩放以后的左上角Y坐标
    let bgY = 0;
    const designWidth = 375;
    const designHeight = 667;
    const designRatio = designWidth / designHeight;
    const viewRatio = width / height;
    // 根据设计稿的宽高比与视口的宽高比判断缩放的基准
    if (designRatio > viewRatio) {
        // 以宽为基准做缩放
        zoom = width / designWidth;
        bgY = -(height / zoom - designHeight) / 2;
    }
    else {
        // 以高为基准做缩放
        zoom = height / designHeight;
        bgX = -(width / zoom - designWidth) / 2;
    }
    return {
        zoom,
        bgX,
        bgY,
        scrollPoint: {
            x: -(width - designWidth) / 2,
            y: -(height - designHeight) / 2,
        },
    };
};
