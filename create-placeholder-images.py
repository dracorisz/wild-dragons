from PIL import Image, ImageDraw, ImageFont
import os
import random

# Define collections and their colors
COLLECTIONS = {
    "dragons": (255, 0, 0),      # Red
    "cosmic": (128, 0, 255),     # Purple
    "elemental": (0, 255, 0),    # Green
    "fantasy": (255, 255, 0),    # Yellow
    "mythical": (0, 128, 255)    # Blue
}

# Image sizes to generate
SIZES = {
    "thumb": 256,
    "preview": 512,
    "full": 800
}

def create_placeholder_image(collection, index, size_name, size):
    """Create a placeholder image with collection name and index"""
    
    # Create directory if it doesn't exist
    os.makedirs(f"assets/{collection}", exist_ok=True)
    
    # Create a new image with the collection's color
    base_color = COLLECTIONS.get(collection, (200, 200, 200))
    
    # Add some variation based on index
    color = (
        max(0, min(255, base_color[0] + random.randint(-30, 30))),
        max(0, min(255, base_color[1] + random.randint(-30, 30))),
        max(0, min(255, base_color[2] + random.randint(-30, 30)))
    )
    
    img = Image.new('RGB', (size, size), color)
    draw = ImageDraw.Draw(img)
    
    # Add a pattern or texture
    for i in range(0, size, 20):
        line_color = (
            max(0, min(255, color[0] + random.randint(-50, 50))),
            max(0, min(255, color[1] + random.randint(-50, 50))),
            max(0, min(255, color[2] + random.randint(-50, 50)))
        )
        draw.line([(0, i), (size, i)], fill=line_color, width=1)
        draw.line([(i, 0), (i, size)], fill=line_color, width=1)
    
    # Add text
    text_color = (255, 255, 255)  # White text
    text = f"{collection} #{index}"
    
    # Try to use a font, fall back to default if not available
    try:
        font_size = size // 10
        font = ImageFont.truetype("arial.ttf", font_size)
        # Fix for newer Pillow versions
        try:
            # For Pillow >= 9.0.0
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
        except AttributeError:
            # For older Pillow versions
            text_width, text_height = draw.textsize(text, font)
            
        position = ((size - text_width) // 2, (size - text_height) // 2)
        draw.text(position, text, font=font, fill=text_color)
    except Exception as e:
        # Fallback if font not available
        draw.text((size//10, size//2), text, fill=text_color)
    
    # Save the image
    filename = f"assets/{collection}/{collection}_{index}"
    if size_name != "full":
        filename += f"_{size_name}"
    filename += ".png"
    
    img.save(filename)
    print(f"Created {filename}")
    
    return filename

def main():
    """Generate placeholder images for all collections"""
    print("Creating placeholder images...")
    
    # Create assets directory if it doesn't exist
    os.makedirs("assets", exist_ok=True)
    
    # For each collection
    for collection, color in COLLECTIONS.items():
        print(f"\nGenerating images for collection: {collection}")
        
        # For items 1-10 in each collection
        for index in range(1, 11):
            # Create each size
            for size_name, size in SIZES.items():
                create_placeholder_image(collection, index, size_name, size)
    
    print("\nPlaceholder image generation complete!")

if __name__ == "__main__":
    main()
