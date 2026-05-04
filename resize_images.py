import os
from PIL import Image, ImageOps

def create_responsive_images(source_filename, base_dir, centering=(0.5, 0.5)):
    source_path = os.path.join(base_dir, source_filename)
    try:
        img = Image.open(source_path)
    except Exception as e:
        print(f"Error opening image {source_filename}: {e}")
        return

    # Dimensions for different devices (width, height)
    sizes = {
        'laptop': (1920, 1080),
        'tablet': (1536, 2048),
        'mobile': (1080, 1920)
    }

    for device, (width, height) in sizes.items():
        out_dir = os.path.join(base_dir, device)
        os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, source_filename)
        
        # Resize and crop to fill the target size
        # Using (0.5, 0.5) for general centering, (0.5, 0.3) for focus on faces
        resized_img = ImageOps.fit(img, (width, height), method=Image.LANCZOS, centering=centering)
        
        # Save with high quality
        resized_img.save(out_path, 'JPEG', quality=90)
        print(f"Created {device} version of {source_filename} at {out_path}")

if __name__ == "__main__":
    base = 'assets/images'
    # List of images to process with optional custom centering
    images_to_process = [
        {"name": "foto-23.jpg", "centering": (0.5, 0.5)},
        {"name": "foto-43.jpg", "centering": (0.5, 0.6)}, # Slightly lower to catch the embrace
        {"name": "foto-17.jpg", "centering": (0.5, 0.5)},
        {"name": "foto-37.jpg", "centering": (0.5, 0.5)},
        {"name": "foto-31.jpg", "centering": (0.5, 0.5)},
        {"name": "foto-57.jpg", "centering": (0.5, 0.5)},
        {"name": "foto-15.jpg", "centering": (0.5, 0.5)},
        {"name": "foto-39.jpg", "centering": (0.5, 0.5)}
    ]
    
    for img_info in images_to_process:
        create_responsive_images(img_info["name"], base, centering=img_info["centering"])
