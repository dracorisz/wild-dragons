import os
import json
import argparse
from PIL import Image
import shutil
import time

class ImageProcessor:
    """
    Process and optimize images for the Wild Dragons NFT marketplace.
    """
    
    def __init__(self, input_dir, output_dir):
        """
        Initialize the image processor.
        
        Args:
            input_dir (str): Directory containing input images
            output_dir (str): Directory to save processed images
        """
        self.input_dir = input_dir
        self.output_dir = output_dir
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Define image sizes
        self.sizes = {
            "thumb": (256, 256),
            "preview": (512, 512),
            "full": None  # Original size
        }
    
    def process_image(self, image_path, collection_name, token_id):
        """
        Process an image into multiple sizes.
        
        Args:
            image_path (str): Path to the input image
            collection_name (str): Collection name for organization
            token_id (str): Token ID for naming
            
        Returns:
            dict: Paths to processed images
        """
        try:
            # Create collection directory if it doesn't exist
            collection_dir = os.path.join(self.output_dir, collection_name)
            os.makedirs(collection_dir, exist_ok=True)
            
            # Open the image
            img = Image.open(image_path)
            
            # Convert RGBA to RGB if needed
            if img.mode == 'RGBA':
                background = Image.new('RGB', img.size, (0, 0, 0))
                background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
                img = background
            
            result = {}
            
            # Process each size
            for size_name, dimensions in self.sizes.items():
                if dimensions:
                    # Resize the image while preserving aspect ratio
                    img_copy = img.copy()
                    img_copy.thumbnail(dimensions)
                    
                    # Create a blank image with the exact dimensions
                    new_img = Image.new("RGB", dimensions, (0, 0, 0))
                    
                    # Paste the resized image centered on the blank image
                    paste_x = (dimensions[0] - img_copy.width) // 2
                    paste_y = (dimensions[1] - img_copy.height) // 2
                    new_img.paste(img_copy, (paste_x, paste_y))
                    
                    # Save the image
                    output_filename = f"{token_id}_{size_name}.png"
                    output_path = os.path.join(collection_dir, output_filename)
                    new_img.save(output_path, "PNG", quality=95, optimize=True)
                else:
                    # Save original size
                    output_filename = f"{token_id}.png"
                    output_path = os.path.join(collection_dir, output_filename)
                    img.save(output_path, "PNG", quality=95, optimize=True)
                
                result[size_name] = output_path
                
            return {
                "original": image_path,
                "processed": result
            }
                
        except Exception as e:
            print(f"Error processing image {image_path}: {e}")
            return None
    
    def process_collection(self, collection_name, image_mapping):
        """
        Process all images for a collection.
        
        Args:
            collection_name (str): Name of the collection
            image_mapping (dict): Mapping of token IDs to image paths
            
        Returns:
            dict: Results of image processing
        """
        print(f"Processing images for collection: {collection_name}")
        
        results = {}
        for token_id, image_path in image_mapping.items():
            result = self.process_image(image_path, collection_name, token_id)
            if result:
                results[token_id] = result
                print(f"Processed image for token {token_id}")
            
        return results
    
    def process_pinterest_images(self):
        """
        Process images downloaded from Pinterest.
        
        Returns:
            dict: Results of image processing by category
        """
        print("Processing Pinterest images...")
        
        results = {}
        
        # Get all category directories
        category_dirs = [d for d in os.listdir(self.input_dir) 
                        if os.path.isdir(os.path.join(self.input_dir, d))]
        
        for category in category_dirs:
            category_path = os.path.join(self.input_dir, category)
            category_images = [f for f in os.listdir(category_path) 
                             if os.path.isfile(os.path.join(category_path, f)) and 
                             f.lower().endswith(('.png', '.jpg', '.jpeg'))]
            
            print(f"Found {len(category_images)} images in category: {category}")
            
            # Process each image in the category
            category_results = {}
            for i, img_name in enumerate(category_images):
                img_path = os.path.join(category_path, img_name)
                token_id = f"{category}_{i+1:04d}"
                
                result = self.process_image(img_path, category, token_id)
                if result:
                    category_results[token_id] = result
            
            results[category] = category_results
            print(f"Processed {len(category_results)} images for category: {category}")
            
        return results
    
    def run(self):
        """
        Run the image processor on all input images.
        
        Returns:
            dict: Results of image processing
        """
        print(f"Starting image processor...")
        print(f"Input directory: {self.input_dir}")
        print(f"Output directory: {self.output_dir}")
        
        # Check if input directory is specifically Pinterest thumbnails
        if "pinterest-thumbs" in self.input_dir:
            results = self.process_pinterest_images()
            
            # Save processing results
            with open(os.path.join(self.output_dir, "image_processing_results.json"), 'w') as f:
                json.dump(results, f, indent=2)
                
            return results
        else:
            # TODO: Add logic for processing other image sources
            print("Only Pinterest image processing is currently implemented")
            return {}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process and optimize images for Wild Dragons NFT marketplace')
    parser.add_argument('--input', type=str, required=True, help='Input directory containing images')
    parser.add_argument('--output', type=str, default='assets', help='Output directory for processed images')
    
    args = parser.parse_args()
    
    processor = ImageProcessor(input_dir=args.input, output_dir=args.output)
    processor.run()
