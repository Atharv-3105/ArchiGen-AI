def wrap_text(text:str, max_chars_per_line: int = 22)-> str:
    
    words = text.split()
    lines = []
    current_line = []
    current_length = 0
    
    for word in words:
        
        if current_length + len(word) + len(current_line) > max_chars_per_line:
            if current_line:
                lines.append(" ".join(current_line))
            
            current_line = [word]
            current_length = len(word)
            
        else:
            current_line.append(word)
            current_length += len(word)
            
    
    if current_line:
        lines.append(" ".join(current_line))
        
    return "\n".join(lines)
