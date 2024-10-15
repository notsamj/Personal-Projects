const PROGRAM_DATA = {
    "general": {
        "frame_rate": 60
    },
    "sound_data": {
        "sounds": [],
        "using_local": false,
        "local_url": "./songs/local",
        "public_url": "./songs/public",
        "file_type": ".mp3",
        "ongoing_shutoff_delay": 100 // 100ms
    },
    "menu": {
        "option_slider": {
            "slider_width_px": 20
        },
        "main_menu": {
            "gap_size": 40,
            "component_details": {
                "play_button": {
                    "x_size": 800,
                    "y_size": 120,
                    "fill_colour": "#3bc44b",
                    "text_colour": "#e6f5f4"
                },
                "credits": {
                    "x": 0,
                    "y": 250,
                    "y_size": 200,
                    "colour": "#000000",
                    "text": "Made by notsamj."
                },
                "load_button": {
                    "text": "Load Song Data",
                    "fill_colour": "#3bc44b",
                    "text_colour": "#e6f5f4",
                },
                "sound_settings_button": {
                    "text": "Sound",
                    "fill_colour": "#3bc44b",
                    "text_colour": "#e6f5f4"
                } 
            }
        },
    
        "player_menu": {
            "gap_size": 50,
            "component_details": {
                "back_button": {
                    "x_size": 200,
                    "y_size": 76,
                    "x": 50,
                    "back_button_y_gap": 27,
                    "text": "Main Menu",
                    "fill_colour": "#3bc44b",
                    "text_colour": "#e6f5f4"
                },
                "song_name": {
                    "width": 800,
                    "height": 200,
                    "top_buffer": 100,
                    "colour_code": "#6f279c",
                    "text": "Song Name",
                    "position_x": "center",
                    "position_y": "top"
                },
                "play_button": {
                    "x": 50,
                    "y": 80,
                    "width": 100,
                    "height": 50,
                    "play_text": "Play",
                    "pause_text": "Pause",
                    "play_colour": "#61ed68",
                    "pause_colour": "#eb4034",
                    "text_colour": "#ffffff"
                },
                "slider": {
                    "height": 50,
                    "width": 1620,
                    "x": 150,
                    "y": 80,
                    "background_colour": "#000000",
                    "slider_colour": "#94151d",
                    "text_colour": "#000000"
                },
                "lyric": {
                    "width": 1200,
                    "height": 400,
                    "colour_code": "#32e34c",
                    "position_y": "top",
                    "position_x": "center",
                    "buffer": 50
                },
                "next_lyric": {
                    "width": 1200,
                    "height": 100,
                    "colour_code": "#f0f0f0",
                    "position_y": "top",
                    "position_x": "center",
                    "buffer": 20
                },
                "chord": {
                    "width": 400,
                    "height": 90,
                    "colour_code": "#5972ff",
                    "position_y": "top",
                    "position_x": "center",
                    "buffer": 20
                },
                "strum_style": {
                    "width": 800,
                    "height": 120,
                    "colour_code": "#f06718",
                    "position_y": "top",
                    "position_x": "center",
                    "buffer": 20
                },
            },
        },
        "sound_menu": {
            "component_details": {
                "back_button": {
                    "x_size": 200,
                    "y_size": 76,
                    "x": 50,
                    "back_button_y_gap": 27,
                    "text": "Main Menu",
                    "fill_colour": "#3bc44b",
                    "text_colour": "#e6f5f4"
                },
                "sound_changer": {
                    "width": 200,
                    "height": 50,
                    "y_size": 100,
                    "label_x_size": 300,
                    "label_x": 600,
                    "label_y_size": 100,
                    "top_gap": 27,
                    "position_x": "center",
                    "position_y": "middle",
                    "theme_colour_code": "#f5d442",
                    "background_colour_code": "#000000"
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