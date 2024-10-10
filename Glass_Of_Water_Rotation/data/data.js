const PROGRAM_DATA = {
    "general": {
        "frame_rate": 60
    },
    "quiz": {
        "seed": null // null -> random, else set seed
    },
    "menu": {
        "main_menu": {
            "gap_size": 40,
            "component_details": {
                "quiz_button": {
                    "x_size": 800,
                    "y_size": 120,
                    "fill_colour": "#3bc44b",
                    "text_colour": "#e6f5f4",
                    "text": "Quiz"
                },
                "credits": {
                    "x": 0,
                    "y": 250,
                    "y_size": 200,
                    "colour": "#000000",
                    "text": "Made by notsamj."
                }
            }
        },
        "quiz": {
            "component_details": {
                "water_glass_component": {
                    "glass_colour": "#000000",
                    "empty_colour": "#ffffff",
                    "water_colour": "#38e8e5",
                    "side_width": 2
                }
            }
        }
    },
    "ui": {
        "font_family": "arial",
        "text_box_padding_proportion": 0.1,
        "disabled_colour": "#e6e6e6"
    }
}