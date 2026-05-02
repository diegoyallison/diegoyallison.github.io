import os
from PIL import Image, ImageOps

def create_responsive_images(source_path, base_dir):
    try:
        img = Image.open(source_path)
    except Exception as e:
        print(f"Error opening image: {e}")
        return

    # Definir dimensiones y ratios (width, height)
    sizes = {
        'laptop': (1920, 1080),
        'tablet': (1536, 2048),
        'mobile': (1080, 1920)
    }

    # centering=(0.5, 0.3) helps keep faces (usually in the upper-middle part) in frame
    for device, (width, height) in sizes.items():
        out_dir = os.path.join(base_dir, device)
        os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, 'foto-37.jpg')
        
        # Resize and crop to fill the target size
        resized_img = ImageOps.fit(img, (width, height), method=Image.LANCZOS, centering=(0.5, 0.3))
        
        # Save with high quality
        resized_img.save(out_path, 'JPEG', quality=90)
        print(f"Created {device} version at {out_path}")

if __name__ == "__main__":
    source = 'assets/images/foto-37.jpg'
    base = 'assets/images'
    create_responsive_images(source, base)
